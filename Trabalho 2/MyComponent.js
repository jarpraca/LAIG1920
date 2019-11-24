/**
 * MyComponent
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - id of the object
 * @param transfMatrix - transformation matrix
 * @param animation - animation's id
 * @param materials - materials of the component
 * @param texture - texture of the component
 * @param length_s - s coordinate of texture
 * @param length_t - t coordinate of texture
 * @param components - children components
 * @param primitives - children primitives
 */
class MyComponent extends CGFobject {
    constructor(scene, id, transfMatrix, animation, materials, texture, length_s, length_t, components, primitives) {
        super(scene);

        this.id=id;
        this.transformations = transfMatrix;
        this.animation = animation;
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


