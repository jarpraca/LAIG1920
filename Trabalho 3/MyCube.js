/**
 * MyCube
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - id of the object
 * @param side - cube's side
*/
class MyCube extends CGFobject {
    constructor(scene, id, side) {
        super(scene);
        this.id = id;
        this.side = side;
        this.initBuffers();
    }

    initBuffers() {
        this.quad = new Plane(this.scene, this.id, 10, 10);
    }

    display() {
        // Bottom
        this.scene.pushMatrix();
        this.scene.scale(this.side, this.side, this.side);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.quad.display();
        this.scene.popMatrix();

        // Side 1
        this.scene.pushMatrix();
        this.scene.scale(this.side, this.side, this.side);
        this.scene.translate(0, 0.5, 0.5);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.quad.display();
        this.scene.popMatrix();

        // Side 2
        this.scene.pushMatrix();
        this.scene.scale(this.side, this.side, this.side);
        this.scene.translate(0.5, 0.5, 0);
        this.scene.rotate(-Math.PI / 2, 0, 0, 1);
        this.quad.display();
        this.scene.popMatrix();

        // Side 3
        this.scene.pushMatrix();
        this.scene.scale(this.side, this.side, this.side);
        this.scene.translate(0, 0.5, -0.5);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.quad.display();
        this.scene.popMatrix();

        // Side 4
        this.scene.pushMatrix();
        this.scene.scale(this.side, this.side, this.side);
        this.scene.translate(-0.5, 0.5, 0);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.quad.display();
        this.scene.popMatrix();

        // Top
        this.scene.pushMatrix();
        this.scene.scale(this.side, this.side, this.side);
        this.scene.translate(0, 1, 0);
        this.quad.display();
        this.scene.popMatrix();
    }
}


