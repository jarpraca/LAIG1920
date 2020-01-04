/**
 * MyAuxiliarBoard
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - id of the object
 * @param tileID - id of the first tile
*/
class MyAuxiliarBoard extends CGFobject {
    constructor(scene, id, tileID) {
        super(scene);
        this.id = id;
        this.tileID = tileID;
        this.tiles = [];
        this.quad = new MyCube(this.scene, 'quad', 20);

        this.initTiles();
        this.initPieces();
        this.initMaterial();
        this.addTexture();
    }

    initTiles() {
        for (let col = this.tileID.charCodeAt(0); col <= this.tileID.charCodeAt(0) + 7; col++) {
            this.tiles.push(new MyTile(this.scene, String.fromCharCode(col), 0, String.fromCharCode(col), this));
        }
    }

    initPieces() {
        if (this.id == 'aux1')
            this.pieceColor = 'W';
        else if (this.id == 'aux2')
            this.pieceColor = 'B';

        let piece;

        piece = new MyPiece(this.scene, this.pieceColor + 'O1');
        this.addPieceToTileByID(piece, this.tiles[0].id);
        piece = new MyPiece(this.scene, this.pieceColor + 'O2');
        this.addPieceToTileByID(piece, this.tiles[1].id);
        piece = new MyPiece(this.scene, this.pieceColor + 'Y1');
        this.addPieceToTileByID(piece, this.tiles[2].id);
        piece = new MyPiece(this.scene, this.pieceColor + 'Y2');
        this.addPieceToTileByID(piece, this.tiles[3].id);
        piece = new MyPiece(this.scene, this.pieceColor + 'S1');
        this.addPieceToTileByID(piece, this.tiles[4].id);
        piece = new MyPiece(this.scene, this.pieceColor + 'S2');
        this.addPieceToTileByID(piece, this.tiles[5].id);
        piece = new MyPiece(this.scene, this.pieceColor + 'C1');
        this.addPieceToTileByID(piece, this.tiles[6].id);
        piece = new MyPiece(this.scene, this.pieceColor + 'C2');
        this.addPieceToTileByID(piece, this.tiles[7].id);

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

    addPieceToTile(piece, tile) {
        for (let key in this.tiles) {
            if (this.tiles[key] == tile && this.tiles[key].getPiece() == null) {
                this.tiles[key].setPiece(piece);
                piece.setTile(this.tiles[key]);
                return true;
            }
        }
        return false;
    }

    addPieceToTileByID(piece, tile) {
        for (let key in this.tiles) {
            if (this.tiles[key].id == tile && this.tiles[key].getPiece() == null) {
                this.tiles[key].setPiece(piece);
                //piece.setTile(this.tiles[key]);
                return true;
            }
        }
        return false;
    }

    removePieceFromTile(tile) {
        for (let key in this.tiles) {
            if (this.tiles[key] == tile) {
                this.tiles[key].removePiece();
                return true;
            }
        }
        return false;
    }

    removePieceFromTileByID(tile) {
        for (let key in this.tiles) {
            if (this.tiles[key].id == tile) {
                this.tiles[key].removePiece();
                return true;
            }
        }
        return false;
    }

    getPieceOnTileByID(tile) {
        for (let key in this.tiles) {
            if (this.tiles[key].id == tile) {
                return this.tiles[key].getPiece();
            }
        }

        return null;
    }

    getTileWithPieceByID(piece) {
        for (let key in this.tiles) {
            if (this.tiles[key].getPiece() != null && this.tiles[key].getPiece().id == piece) {
                return this.tiles[key];
            }
        }

        return null;
    }

    getTileByID(tile) {
        for (let key in this.tiles) {
            if (this.tiles[key].id == tile) {
                return this.tiles[key];
            }
        }

        return null;
    }

    getTileByCoordinates(row, col) {
        for (let key in this.tiles) {
            if (this.tiles[key].row == row && this.tiles[key].col == col) {
                return this.tiles[key];
            }
        }

        return null;
    }

    movePiece(pieceID, finalTileID) {
        // animation

        let initialTileID = this.getTileWithPieceByID(pieceID).id;
        let piece = this.getPieceOnTileByID(initialTileID);
        this.removePieceFromTileByID(initialTileID);
        this.addPieceToTileByID(piece, finalTileID);
    }

    display() {
        this.scene.pushMatrix();
        this.material.apply();
        // Quad 1
        this.scene.pushMatrix();
        this.scene.scale(0.5, 0.1, 1);
        this.scene.translate(0, 0, 20);
        this.quad.display();
        this.scene.translate(0, 0, -20);
        this.quad.display();
        this.scene.translate(0, 0, -20);
        this.quad.display();
        this.scene.popMatrix();

        // Tiles
        let i = 0;
        for (let key in this.tiles) {
            this.scene.pushMatrix();
            this.scene.translate(0, 2, 24 - i * 7);
            this.tiles[key].display();
            this.scene.popMatrix();
            i++;
        }
        this.scene.popMatrix();
    }
}