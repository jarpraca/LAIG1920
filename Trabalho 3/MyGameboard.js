/**
 * MyGameboard
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - id of the object
*/
class MyGameboard extends CGFobject {
    constructor(scene, id) {
        super(scene);
        this.id = id;
        this.tiles = [];
        this.quad = new MyCube(this.scene, 'quad', 20);
        this.auxBoard1 = new MyAuxiliarBoard(this.scene, 'aux1', '1');
        this.auxBoard2 = new MyAuxiliarBoard(this.scene, 'aux2', 'a');

        this.initTiles();
        this.initPieces();
        this.initMaterial();
        this.addTexture();
    }

    initTiles() {
        for (let row = '1'.charCodeAt(0); row <= '4'.charCodeAt(0); row++) {
            for (let col = 'a'.charCodeAt(0); col <= 'd'.charCodeAt(0); col++) {
                this.tiles.push(new MyTile(this.scene, String.fromCharCode(row) + String.fromCharCode(col), String.fromCharCode(row), String.fromCharCode(col), this));
            }
        }
    }

    initPieces() {
        this.auxBoard1.initPieces();
        this.auxBoard2.initPieces();
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
        // Gameboard
        for (let key in this.tiles) {
            if (this.tiles[key] == tile && this.tiles[key].getPiece() == null) {
                this.tiles[key].setPiece(piece);
                this.tiles[key].disableSelectable();
                return true;
            }
        }

        // Auxiliar Board 1
        if (this.auxBoard1.addPieceToTile(piece, tile))
            return true;

        // Auxiliar Board 2
        if (this.auxBoard2.addPieceToTile(piece, tile))
            return true;

        return false;
    }

    addPieceToTileByID(piece, tile) {
        for (let key in this.tiles) {
            if (this.tiles[key].id == tile && this.tiles[key].getPiece() == null) {
                this.tiles[key].setPiece(piece);
                this.tiles[key].disableSelectable();
                return true;
            }
        }

        // Auxiliar Board 1
        if (this.auxBoard1.addPieceToTileByID(piece, tile))
            return true;

        // Auxiliar Board 2
        if (this.auxBoard2.addPieceToTileByID(piece, tile))
            return true;

        return false;
    }

    removePieceFromTile(tile) {
        for (let key in this.tiles) {
            if (this.tiles[key] == tile) {
                this.tiles[key].removePiece();
                return true;
            }
        }

        // Auxiliar Board 1
        if (this.auxBoard1.removePieceFromTile(tile))
            return true;

        // Auxiliar Board 2
        if (this.auxBoard2.removePieceFromTile(tile))
            return true;

        return false;
    }

    removePieceFromTileByID(tile) {
        for (let key in this.tiles) {
            if (this.tiles[key].id == tile) {
                this.tiles[key].removePiece();
                return true;
            }
        }

        // Auxiliar Board 1
        if (this.auxBoard1.removePieceFromTileByID(tile))
            return true;

        // Auxiliar Board 2
        if (this.auxBoard2.removePieceFromTileByID(tile))
            return true;

        return false;
    }

    getPieceByID(piece) {
        for (let key in this.tiles) {
            if (this.tiles[key].getPiece() != null && this.tiles[key].getPiece().id == piece) {
                return this.tiles[key].getPiece();
            }
        }

        // Auxiliar Board 1
        let aux1 = this.auxBoard1.getPieceByID(piece);
        if (aux1 != null)
            return aux1;

        // Auxiliar Board 2
        let aux2 = this.auxBoard2.getPieceByID(piece);
        if (aux2 != null)
            return aux2;

        return null;
    }

    getPieceOnTileByID(tile) {
        for (let key in this.tiles) {
            if (this.tiles[key].id == tile) {
                return this.tiles[key].getPiece();
            }
        }

        // Auxiliar Board 1
        let aux1 = this.auxBoard1.getPieceOnTileByID(tile);
        if (aux1 != null)
            return aux1;

        // Auxiliar Board 2
        let aux2 = this.auxBoard2.getPieceOnTileByID(tile);
        if (aux2 != null)
            return aux2;

        return null;
    }

    getTileWithPieceByID(piece) {
        for (let key in this.tiles) {
            if (this.tiles[key].getPiece() != null && this.tiles[key].getPiece().id == piece) {
                return this.tiles[key];
            }
        }

        // Auxiliar Board 1
        let aux1 = this.auxBoard1.getTileWithPieceByID(piece);
        if (aux1 != null)
            return aux1;

        // Auxiliar Board 2
        let aux2 = this.auxBoard2.getTileWithPieceByID(piece);
        if (aux2 != null)
            return aux2;

        return null;
    }

    getTileByID(tile) {
        for (let key in this.tiles) {
            if (this.tiles[key].id == tile) {
                return this.tiles[key];
            }
        }

        // Auxiliar Board 1
        let aux1 = this.auxBoard1.getTileByID(tile);
        if (aux1 != null)
            return aux1;

        // Auxiliar Board 2
        let aux2 = this.auxBoard2.getTileByID(tile);
        if (aux2 != null)
            return aux2;

        return null;
    }

    getTileByCoordinates(row, col) {
        for (let key in this.tiles) {
            if (this.tiles[key].row == row && this.tiles[key].col == col) {
                return this.tiles[key];
            }
        }

        // Auxiliar Board 1
        let aux1 = this.auxBoard1.getTileByCoordinates(row, col);
        if (aux1 != null)
            return aux1;

        // Auxiliar Board 2
        let aux2 = this.auxBoard2.getTileByCoordinates(row, col);
        if (aux2 != null)
            return aux2;

        return null;
    }

    getAllPlayerPieceTypes(player) {
        switch (player) {
            case 1:
                return this.auxBoard1.getAllPieceTypes();
            case 2:
                return this.auxBoard2.getAllPieceTypes();
        }

        return [];
    }

    getAllBoardPieceTypes() {
        let pieces = [];
        for (var key in this.tiles) {
            pieces.push(this.tiles[key].getPrologCell());
        }

        return pieces;
    }

    playerHasPiece1(pieceType) {
        let aux1 = this.auxBoard1.getTileWithPieceByID(pieceType + '1');

        if (aux1 != null)
            return true;

        let aux2 = this.auxBoard2.getTileWithPieceByID(pieceType + '1');

        if (aux2 != null)
            return true;

        return false;
    }

    belongsToPlayer(pieceID, player) {
        switch (player) {
            case 1: {
                let aux = this.auxBoard1.getTileWithPieceByID(pieceID);

                return (aux != null);
            }
            case 2: {
                let aux = this.auxBoard2.getTileWithPieceByID(pieceID);

                return (aux != null);
            }
        }
        return false;
    }

    movePiece(pieceID, finalTileID) {
        // animation
        let initialTileID = this.getTileWithPieceByID(pieceID).id;
        let piece = this.getPieceOnTileByID(initialTileID);
        this.getTileByID(initialTileID).disableSelected();
        piece.disableSelectable();
        piece.disableSelected();
        this.addPieceToTileByID(piece, finalTileID);
        this.removePieceFromTileByID(initialTileID);
    }

    display() {
        this.scene.pushMatrix();
        this.material.apply();

        // Quad 1
        this.scene.pushMatrix();
        this.scene.translate(-10, 0, 10);
        this.scene.scale(1, 0.1, 1);
        this.quad.display();
        this.scene.popMatrix();
        // Quad 2
        this.scene.pushMatrix();
        this.scene.translate(-10, 0, -10);
        this.scene.scale(1, 0.2, 1);
        this.quad.display();
        this.scene.popMatrix();
        // Quad 3
        this.scene.pushMatrix();
        this.scene.translate(10, 0, 10);
        this.scene.scale(1, 0.2, 1);
        this.quad.display();
        this.scene.popMatrix();
        // Quad 4
        this.scene.pushMatrix();
        this.scene.translate(10, 0, -10);
        this.scene.scale(1, 0.1, 1);
        this.quad.display();
        this.scene.popMatrix();

        //Tiles
        for (let key in this.tiles) {
            this.scene.pushMatrix();
            this.tiles[key].translate();
            this.tiles[key].display();
            this.scene.popMatrix();
        }

        // AuxiliarBoard 1
        this.scene.pushMatrix();
        this.scene.translate(30, 0, 0);
        this.auxBoard1.display();
        this.scene.popMatrix();

        // AuxiliarBoard 2
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(30, 0, 0);
        this.auxBoard2.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}


