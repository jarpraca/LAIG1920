/**
 * MyTile
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - id of the object
 * @param shape - shape of piece
 * @param color - color of piece
 * @param gameboard - gameboard reference
*/
class MyTile extends CGFobject {
    constructor(scene, id, row, col, gameboard) {
        super(scene);
        this.id = id;
        this.row = row;
        this.col = col;
        this.calcQuad();
        this.calcPosition();
        this.gameboard = gameboard;
        this.piece = null;
        this.tile = new MyCylinderPiece(this.scene, this.id, 30, 30, 2, 2, 1);

        this.setPiece(null);
        this.initMaterial();
        this.addTexture();
    }

    initMaterial() {
        this.material = new CGFappearance(this.scene);
        this.material.setEmission(0, 0, 0, 1);
        this.material.setAmbient(0.05, 0.05, 0.05, 1);
        this.material.setDiffuse(0.8, 0.8, 0.8, 1);
        this.material.setSpecular(0.4, 0.4, 0.4, 1);
    }

    addTexture() {
        this.texture = new CGFtexture(this.scene, 'scenes/images/hard_plastic.jpg');
        this.material.setTexture(this.texture);
    }

    getPiece() {
        return this.piece;
    }

    setPiece(piece) {
        this.piece = piece;
    }

    removePiece() {
        this.piece = null;
    }

    calcQuad() {
        if (this.row == '1' || this.row == '2') {
            if (this.col == 'a' || this.col == 'b')
                this.quad = 1;
            else if (this.col == 'c' || this.col == 'd')
                this.quad = 2;
        }
        else if (this.row == '3' || this.row == '4') {
            if (this.col == 'a' || this.col == 'b')
                this.quad = 3;
            else if (this.col == 'c' || this.col == 'd')
                this.quad = 4;
        }
    }

    calcPosition() {
        switch (this.row) {
            case '1':
                this.x = -6 - 8;
                break;
            case '2':
                this.x = -6;
                break;
            case '3':
                this.x = 6;
                break;
            case '4':
                this.x = 6 + 8;
                break;
        }

        switch (this.col) {
            case 'a':
                this.z = 6 + 8;
                break;
            case 'b':
                this.z = 6;
                break;
            case 'c':
                this.z = -6;
                break;
            case 'd':
                this.z = -6 - 8;
                break;
        }

        switch (this.quad) {
            case 1:
                this.y = 2;
                break;
            case 2:
                this.y = 4;
                break;
            case 3:
                this.y = 4;
                break;
            case 4:
                this.y = 2;
                break;
        }
    }

    translate(scene){
        scene.translate(this.x, this.y, this.z);
    }

    display() {
        this.scene.pushMatrix();
        //this.scene.translate(this.x, this.y, this.z);
        this.material.apply();
        this.tile.display();
        if(this.piece != null)
            this.piece.display();
        this.scene.popMatrix();
    }
}


