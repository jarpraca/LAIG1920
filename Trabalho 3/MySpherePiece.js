/**
 * MySpherePiece (with top and using NURBS)
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - id of the object
 * @param slices - number of slices
 * @param stacks - number of stacks
 * @param radius - radius of the sphere
*/
class MySpherePiece extends CGFobject {
    constructor(scene, id, slices, stacks, radius) {
        super(scene);
        this.id = id;
        this.slices = slices;
        this.stacks = stacks;
        this.radius = radius;
        this.initBuffers();
    }

    initBuffers() {
        this.sphere = new MySphere(this.scene, this.id, this.slices, this.stacks, this.radius);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(0, this.radius, 0);
        this.sphere.display();
        this.scene.popMatrix();
    }
}
