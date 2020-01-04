/**
 * MyGameMove
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - id of the object
 * @param piece - piece moved
 * @param originTile - origin tile
 * @param destinationTile - destination tile
 * @param initialGameboard - gameboard before move
*/
class MyGameMove extends CGFobject {
    constructor(scene, id, piece, originTile, destinationTile, initialGameboard) {
        super(scene);
        this.id = id;
        this.piece = piece;
        this.originTile = originTile;
        this.destinationTile = destinationTile;
        this.initialGameboard = initialGameboard;
    }

    animate() {
        
    }
}


