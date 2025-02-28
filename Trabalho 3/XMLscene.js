var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.cameras = [];
        this.camerasIDs = {};
        this.lightToggles = [];
        this.initCameras();

        this.gameMode = "Player vs Player";
        this.modeIDs = ["Player vs Player", "Player vs Bot", "Bot vs Bot"];
        this.difficultyBot = "Easy";
        this.difficultyBot1 = "Easy";
        this.difficultyBot2 = "Easy";
        this.gameDifficulty = "Easy";
        this.difficultyIDs = ["Easy", "Medium", "Hard"];
        this.selectedTheme = 'Room';
        this.themeIDs = ['Bar', 'Room'];
        this.gameOrchestrator = null;
        this.filename = getUrlVars()['file'] || "LAIG_TP3_XML_T7_G04_v01.xml";

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(50);

        // this.objects = [
        //     new CGFplane(this)
        // ];

        this.setPickEnabled(true);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        var i = 0;
        if (this.sceneInited) {
            for (var key in this.graph.views) {
                this.cameras[i] = this.graph.views[key];
                this.camerasIDs[key] = i;
                i++;
            }
            this.selectedCamera = this.camerasIDs[this.graph.defaultCameraID];
            this.camera = this.cameras[this.selectedCamera];
            this.interface.setActiveCamera(this.camera);
        }
        else
            this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);
                this.lights[i].setConstantAttenuation(light[6][0]);
                this.lights[i].setLinearAttenuation(light[6][1]);
                this.lights[i].setQuadraticAttenuation(light[6][2]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[6]);
                    this.lights[i].setSpotExponent(light[7]);
                    this.lights[i].setSpotDirection(light[8][0], light[8][1], light[8][2]);
                }

                this.lights[i].setVisible(true);
                if (light[0]) {
                    this.lights[i].enable();
                    this.lightToggles[i] = true;
                }
                else {
                    this.lights[i].disable();
                    this.lightToggles[i] = false;
                }

                this.lights[i].update();

                i++;
            }
        }
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        //this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);
        this.gl.clearColor(0, 0, 0, 1);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initLights();

        this.sceneInited = true;
        this.initCameras();
        this.interface.addLightsInterface();
        this.interface.addCamerasInterface();
        this.interface.addGameButtons();
    }

    /**
     * Updates the main camera to the one selected in the interface and sets it as the active camera
     */
    updateCamera() {
        this.camera = this.cameras[this.selectedCamera];
        this.interface.setActiveCamera(this.camera);
    }

    setCameraPlayer(player) {
        this.selectedCamera = player;
        this.updateCamera();
    }

    /**
     * Updates the lights state (on/off)
     */
    updateLights() {
        for (var key in this.lights) {
            if (this.lights.hasOwnProperty(key)) {
                if (this.lightToggles[key])
                    this.lights[key].enable();
                else
                    this.lights[key].disable();

                this.lights[key].update();
            }
        }
    }

    update(t) {
        this.graph.checkKeys();
        this.graph.updateAnimations(t / 1000);
        this.gameOrchestrator.update(t);
    }

    difficultyOptions() {
        this.interface.diffOptions(this.gameMode);
    }

    startGame() {
        console.log("GAME STARTED");

        switch (this.gameMode) {
            case "Player vs Player": {
                this.gameOrchestrator.startGame('p1', 'p2', 0, 0);
                break;
            }
            case "Player vs Bot": {
                let level = this.difficultyIDs.indexOf(this.difficultyBot) + 1;
                this.gameOrchestrator.startGame('p', 'c', 0, level);
                break;
            }
            case "Bot vs Bot": {
                let levelC1 = this.difficultyIDs.indexOf(this.difficultyBot1) + 1;
                let levelC2 = this.difficultyIDs.indexOf(this.difficultyBot2) + 1;
                this.gameOrchestrator.startGame('c1', 'c2', levelC1, levelC2);
                break;
            }
        }

    }

    undo() {
        console.log("MOVE UNDONE");
        this.gameOrchestrator.undo();
    }

    endGame() {
        console.log("GAME ENDED");
        this.gameOrchestrator.endGame();
    }

    quitGame() {
        console.log("GAME QUITTED");
        this.gameOrchestrator.quitGame();
    }

    /**
     * Renders and displays the main camera
     */
    display() {
        if (this.sceneInited) {
            this.gameOrchestrator.orchestrate();

            // Picking objects
            this.gameOrchestrator.managePick(this.pickMode, this.pickResults);
            this.clearPickRegistration();

            // Displays scene
            this.render(this.camera);
        }
    }

    /**
     * Renders the scene in 'camera' perspective.
     */
    render(camera) {

        // this.logPicking();
        // this.clearPickRegistration();
        // ---- BEGIN Background, camera and axis setup
        this.camera = camera;

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();
        this.axis.display();

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].setVisible(true);
            this.lights[i].enable();
        }

        if (this.sceneInited) {
            // Draw axis
            this.setDefaultAppearance();

            // Displays the game
            this.gameOrchestrator.display();
        }

        this.popMatrix();

        // ---- END Background, camera and axis setup
    }
}