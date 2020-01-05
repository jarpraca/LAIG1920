/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        this.initKeys();

        return true;
    }

    addGameButtons() {
        this.settings = this.gui.addFolder("Settings");
        this.settings.open();
        this.settings.add(this.scene, 'selectedTheme', this.scene.themeIDs).name('Theme');
        this.settings.add(this.scene, "gameMode", this.scene.modeIDs).name("Game Mode").onChange(this.scene.difficultyOptions.bind(this.scene));
        this.diffBot = null;
        this.diffBot1 = null;
        this.diffBot2 = null;

        this.startButton = this.gui.add(this.scene, "startGame").name("Start").onChange(this.startGameButtons.bind(this));
        this.quitButton = this.gui.add(this.scene, "quitGame").name("Quit").onChange(this.quitGameButtons.bind(this));
    }

    startGameButtons() {
        this.settings.close();
        this.startButton.remove();
        this.startButton = null;
        this.undoButton = this.gui.add(this.scene, "undo").name("Undo");
        this.endButton = this.gui.add(this.scene, "endGame").name("End").onChange(this.endGameButtons.bind(this));
        this.quitButton.remove();
        this.quitButton = this.gui.add(this.scene, "quitGame").name("Quit").onChange(this.quitGameButtons.bind(this));
    }

    endGameButtons() {
        this.settings.open();
        if (this.startButton == null)
            this.startButton = this.gui.add(this.scene, "startGame").name("Start").onChange(this.startGameButtons.bind(this));
        if (this.undoButton != null) {
            this.undoButton.remove();
            this.undoButton = null;
        }
        if (this.endButton != null) {
            this.endButton.remove();
            this.endButton = null;
        }
        this.quitButton.remove();
        this.quitButton = this.gui.add(this.scene, "quitGame").name("Quit").onChange(this.quitGameButtons.bind(this));
    }

    quitGameButtons() {
        this.settings.close();
        if (this.startButton != null) {
            this.startButton.remove();
            this.startButton = null;
        }

        if (this.undoButton != null) {
            this.undoButton.remove();
            this.undoButton = null;
        }

        if (this.endButton != null) {
            this.endButton.remove();
            this.endButton = null;
        }
    }

    diffOptions(mode) {
        switch (mode) {
            case "Player vs Player":
                if (this.diffBot != null) {
                    this.settings.remove(this.diffBot);
                    this.diffBot = null;
                }
                if (this.diffBot1 != null) {
                    this.settings.remove(this.diffBot1);
                    this.diffBot1 = null;
                }
                if (this.diffBot2 != null) {
                    this.settings.remove(this.diffBot2);
                    this.diffBot2 = null;
                }
                break;
            case "Player vs Bot":
                if (this.diffBot1 != null) {
                    this.settings.remove(this.diffBot1);
                    this.diffBot1 = null;
                }
                if (this.diffBot2 != null) {
                    this.settings.remove(this.diffBot2);
                    this.diffBot2 = null;
                }
                this.diffBot = this.settings.add(this.scene, "difficultyBot", this.scene.difficultyIDs).name("Difficulty Bot");
                break;
            case "Bot vs Bot":
                if (this.diffBot != null) {
                    this.settings.remove(this.diffBot);
                    this.diffBot = null;
                }
                this.diffBot1 = this.settings.add(this.scene, "difficultyBot1", this.scene.difficultyIDs).name("Difficulty Bot 1");
                this.diffBot2 = this.settings.add(this.scene, "difficultyBot2", this.scene.difficultyIDs).name("Difficulty Bot 2");
                break;
        }
    }

    /**
     * Adds two dropdown menus to choose the main camera.
     */
    addCamerasInterface() {
        this.gui.add(this.scene, 'selectedCamera', this.scene.camerasIDs).name('Main Camera').onChange(this.scene.updateCamera.bind(this.scene));
    }

    /**
     * Adds a folder cointaining checkboxes to toggle each light
     */
    addLightsInterface() {
        var lights = this.gui.addFolder("Lights");

        lights.open();

        var i = 0;
        for (var key in this.scene.graph.lights) {
            if (i >= 8)
                break;
            if (this.scene.lights.hasOwnProperty(i)) {
                lights.add(this.scene.lightToggles, i).name('Light ' + key).onChange(this.scene.updateLights.bind(this.scene));
                i++;
            }
        }

        lights.close();
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function () { };
        this.activeKeys = {};
    }

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        console.log(event.code);
        this.activeKeys[event.code] = false;

    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}