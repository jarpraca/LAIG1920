/**
 * MyPieceAnimation
 */
class MyPieceAnimation {
    constructor(scene, piece, initial, final, duration) {
        this.scene = scene;
        this.piece = piece;
        this.initial = initial;
        this.final = final;

        this.duration = duration;
        this.finished = false;
        this.initial_time = 0;
        this.previous_t = 0;
        this.matrix = mat4.create();

    }

    update(time) {
        let t = time / 1000;

        if (this.initial_time == 0) {
            this.initial_time = t;
        }

        let delta = t - this.initial_time;

        if (delta > this.duration) {
            delta = this.duration;
            this.finished = true;
        }

        this.matrix = mat4.create();

        // Translate
        let translate_x = (this.final[0] - this.initial[0])*delta/this.duration;
        let translate_y = (this.final[1] - this.initial[1])*delta/this.duration;
        let translate_z = (this.final[2] - this.initial[2])*delta/this.duration;
        
        let coordinates = [translate_x, translate_y, translate_z];
        mat4.translate(this.matrix, this.matrix, this.initial);
        mat4.translate(this.matrix, this.matrix, coordinates);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.multMatrix(this.matrix);
        if(this.initial_time != 0)
            this.piece.display();
        this.scene.popMatrix();
    }
}