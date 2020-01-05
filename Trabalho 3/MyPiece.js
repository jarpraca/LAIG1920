/**
 * MyPiece
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - id of the object
 * @param shape - shape of piece
 * @param color - color of piece
*/
class MyPiece extends CGFobject {
    constructor(scene, id) {
        super(scene);
        this.id = id;
        this.selectable = true;
        this.selected = false;
        this.parseID();
        this.createUniqueID();
        this.setTile(null);
        this.initMaterial();
        this.addTexture();
        this.initPiece();
    }

    parseID() {
        switch (this.id.charAt(0)) {
            case 'W':
                this.color = 'white';
                break;
            case 'B':
                this.color = 'black';
                break;
        }

        switch (this.id.charAt(1)) {
            case 'O':
                this.shape = 'cone';
                break;
            case 'Y':
                this.shape = 'cylinder';
                break;
            case 'S':
                this.shape = 'sphere';
                break;
            case 'C':
                this.shape = 'cube';
                break;
        }

        this.type = this.id.substring(0,2);
    }

    initMaterial() {
        this.defaultAmbient = 0.3;
        this.material = new CGFappearance(this.scene);
        this.material.setEmission(0, 0, 0, 1);
        this.material.setAmbient(this.defaultAmbient, this.defaultAmbient, this.defaultAmbient, 1);
        this.material.setDiffuse(0.3, 0.3, 0.3, 1);
        this.material.setSpecular(0.8, 0.8, 0.8, 1);
    }

    addTexture() {
        switch (this.color) {
            case 'white':
                this.texture = new CGFtexture(this.scene, 'scenes/images/light_piece.jpg');
                break;
            case 'black':
                this.texture = new CGFtexture(this.scene, 'scenes/images/dark_piece.jpg');
                break;
        }
        this.material.setTexture(this.texture);
    }

    initPiece() {
        switch (this.shape) {
            case 'cylinder':
                this.piece = new MyCylinderPiece(this.scene, this.id, 30, 30, 3, 3, 5.5);
                break;
            case 'cube':
                this.piece = new MyCube(this.scene, this.id, 5.5);
                break;
            case 'cone':
                this.piece = new MyCylinderPiece(this.scene, this.id, 30, 30, 3, 0, 6);
                break;
            case 'sphere':
                this.piece = new MySpherePiece(this.scene, this.id, 30, 30, 3);
                break;
        }
    }

    disableSelectable() {
        this.selectable = false;
    }

    enableSelected() {
        this.selected = true;
        this.material.setAmbient(0, 1, 0, 1);
    }

    disableSelected() {
        this.selected = false;
        this.material.setAmbient(this.defaultAmbient, this.defaultAmbient, this.defaultAmbient, 1);
    }

    createUniqueID() {
        this.uniqueId = 0;
        for(let i = 0; i < this.id.length; i++){
            this.uniqueId += this.id.charCodeAt(i);
        }
        for(let i = 0; i < this.color.length; i++){
            this.uniqueId += this.color.charCodeAt(i);
        }
    }

    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;

        switch (type.codeAt(0)) {
            case 'W':
                this.color = 'white';
                break;
            case 'B':
                this.color = 'black';
                break;
        }

        switch (type.codeAt(1)) {
            case 'O':
                this.shape = 'cone';
                break;
            case 'Y':
                this.shape = 'cylinder';
                break;
            case 'S':
                this.shape = 'sphere';
                break;
            case 'C':
                this.shape = 'cube';
                break;
        }
    }

    getTile() {
        return this.tile;
    }

    setTile(tile) {
        this.tile = tile;
    }

    display() {
        if(this.selectable)
            this.scene.registerForPick(this.uniqueId, this);

        this.scene.pushMatrix();
        this.material.apply();
        this.piece.display();
        this.scene.popMatrix();

        if(this.selectable)
            this.scene.clearPickRegistration();
    }
}


