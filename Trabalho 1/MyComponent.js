/**
* MyComponent
* @constructor
*/
class MyComponent extends CGFobject {
    constructor(scene, id, transfMatrix, materials, texture, length_s, length_t, children) {
        super(scene);

        this.transformations = transfMatrix;
        this.materials = materials;
        this.texture = texture;
        this.length_s = length_s;
        this.length_t = length_t;
        this.children = children;

        this.initBuffers();
    }

    initBuffers() {
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


