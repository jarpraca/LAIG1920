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
        // this.selectedCamera = 0;
        // this.securityCameraID = 0;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(50);

        this.securityTexture = new CGFtextureRTT(this, this.gl.canvas.width, this.gl.canvas.height);

        this.securityCamera = new MySecurityCamera(this, this.securityTexture);

        this.shader = new CGFshader(this.gl, "shaders/vertex_shader.vert", "shaders/fragment_shader.frag");
        
        this.shader.setUniformsValues({camera: 1});
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        var i = 0;
        if(this.sceneInited){
            for(var key in this.graph.views){
                this.cameras[i] = this.graph.views[key];
                this.camerasIDs[key] = i;
                i++;
            }
            this.selectedCamera = this.camerasIDs[this.graph.defaultCameraID];
            this.securityCameraID = this.camerasIDs[this.graph.defaultCameraID];
            this.camera = this.cameras[this.selectedCamera];
            this.sec_camera = this.cameras[this.securityCameraID];
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
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

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

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initLights();

        this.sceneInited = true;
        this.initCameras();
        this.interface.addCamerasInterface();
    }

    updateCamera(){
        this.camera = this.cameras[this.selectedCamera];
        this.interface.setActiveCamera(this.camera);
    }

    updateSecurityCamera(){
        this.sec_camera = this.cameras[this.securityCameraID];
        //this.interface.setActiveCamera(this.sec_camera);
    }

    updateRenderCamera(camera){
        this.camera = camera;
    }

    update(t){
        this.graph.checkKeys();
        this.graph.updateAnimations(t/1000);
        this.shader.setUniformsValues({time: (t/5000)%1000});
    }

    display(){
        // Displays scene
        this.render(this.camera);

        // Renders Security Camera texture
        this.securityTexture.attachToFrameBuffer();
        var main_cam = this.camera;
        this.render(this.sec_camera);
        this.camera = main_cam;
        this.securityTexture.detachFromFrameBuffer();
        
        // Displays Security Camera
        this.setActiveShader(this.shader);
        this.securityTexture.bind(1);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.securityCamera.display();
        this.gl.enable(this.gl.DEPTH_TEST);
        this.setActiveShader(this.defaultShader);
    }

    /**
     * Renders the scene in 'camera' perspective.
     */
    render(camera) {
        // ---- BEGIN Background, camera and axis setup
        this.updateRenderCamera(camera);

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

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}