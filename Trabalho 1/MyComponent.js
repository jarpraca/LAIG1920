/**
* MyComponent
* @constructor
*/
class MyComponent extends CGFobject {
    constructor(scene, id) {
        super(scene);

        this.initBuffers();
    }

    initBuffers() {
        this.transformations = [];
        this.materials = [];
        this.texture;
        this.children = [];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
    updateBuffers(complexity){
        this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}


