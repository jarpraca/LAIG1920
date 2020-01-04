/**
 * MyCylinderPiece (with top and using NURBS)
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - id of the object
 * @param slices - number of slices
 * @param stacks - number of stacks
 * @param radiusBottom - radius of the cylinder's bottom
 * @param radiusTop - radius of the cylinder's top
 * @param height - cylinder's height
*/
class MyCylinderPiece extends CGFobject {
    constructor(scene, id, slices, stacks, radiusBottom, radiusTop, height) {
        super(scene);
        this.id = id;
        this.slices = slices;
        this.stacks = stacks;
        this.radiusBottom = radiusBottom;
        this.radiusTop = radiusTop;
        this.height = height;
        this.initBuffers();
    }

    initBuffers() {
        this.cylinder = new MyCylinder(this.scene, this.id, this.slices, this.stacks, this.radiusBottom, this.radiusTop, this.height);
        this.top = new MySphere(this.scene, this.id, this.slices, this.stacks, this.radiusTop);
        this.bottom = new MySphere(this.scene, this.id, this.slices, this.stacks, this.radiusBottom);
    }

    display() {
        this.scene.pushMatrix();
        // Cylinder
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.cylinder.display();
        // Top
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.height);
        this.scene.scale(1, 1, 0.01);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.top.display();
        this.scene.popMatrix();
        // Bottom
        this.scene.pushMatrix();
        this.scene.scale(1, 1, 0.01);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.bottom.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}
