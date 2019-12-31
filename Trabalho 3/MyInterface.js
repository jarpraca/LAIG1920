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
        
        this.gui.add(this.scene, 'selectedTheme', this.scene.themeIDs).name('Theme');

        return true;
    }

    /**
     * Adds two dropdown menus to choose the main camera.
     */
    addCamerasInterface(){
        this.gui.add(this.scene, 'selectedCamera', this.scene.camerasIDs).name('Main Camera').onChange(this.scene.updateCamera.bind(this.scene));
    }

    /**
     * Adds a folder cointaining checkboxes to toggle each light
     */
    addLightsInterface(){
        var lights = this.gui.addFolder("Lights");

        lights.open();

        var i = 0;
        for (var key in this.scene.graph.lights) {
            if(i >= 8)
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
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        console.log(event.code);
        this.activeKeys[event.code]=false;

    };
/*
    processMouseDown(event) {
        this.activeKeys["mouse"]=true;
    };

    processMouseUp(event) {
        this.activeKeys["mouse"]=false;
    };
*/

    /*processMouseMove(event){

        console.log(event.code);

    }*/
    


    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}