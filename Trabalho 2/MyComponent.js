/**
* MyComponent
* @constructor
*/
class MyComponent extends CGFobject {
    constructor(scene, id, transfMatrix, materials, texture, length_s, length_t, components, primitives) {
        super(scene);

        this.id=id;
        this.transformations = transfMatrix;
        this.materials = materials;
        this.texture = texture;
        this.length_s = length_s;
        this.length_t = length_t;
        this.components = components;
        this.primitives = primitives;

        this.initBuffers();
    }

    initBuffers() {
        this.primitiveType = this.scene.gl.TRIANGLES;
    }
    
    updateBuffers(complexity){
        this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}


