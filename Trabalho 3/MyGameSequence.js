/**
 * MyGameSequence
 * @constructor
 * @param scene - Reference to MyScene object
*/
class MyGameSequence extends CGFobject {
    constructor(scene) {
        super(scene);
        this.sequence = [];
    }

    addGameMove(move) {
        this.sequence.push(move);
    }

    getLast() {
        return this.sequence[this.sequence.length - 1];
    }

    undo() {
        this.sequence.pop();
    }

    replay() {

    }
}


