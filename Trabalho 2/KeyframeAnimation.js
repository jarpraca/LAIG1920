/**
* KeyframeAnimation
* @constructor
*/
class KeyframeAnimation{
    constructor(id, keyframes) {
        this.id = id;

        var defaultKeyframe = new Keyframe(0);

        this.keyframes= [defaultKeyframe];

        this.keyframes = this.keyframes.concat(keyframes);

        this.previous_t = 0;

        this.initial_t = 0;

        this.currentKeyframe = 0;
        this.nextKeyframe = 1;
        this.finalKeyframe = keyframes.length;

        this.animMatrix = mat4.create();
    }

    update(t){
        if(this.initial_t == 0){
            this.initial_t = t;
            this.previous_t = t;
            return;
        }

        if(this.nextKeyframe <= this.finalKeyframe && (t - this.initial_t) > this.keyframes[this.nextKeyframe].instant){
            this.nextKeyframe++;
            this.currentKeyframe++;
        }

        var delta_t = t - this.initial_t;

        if(this.nextKeyframe <= this.finalKeyframe){
            console.log("c: "+ this.currentKeyframe + " n: "+this.nextKeyframe);

            this.animMatrix = mat4.create();

            // Translate
            var translate_x = (this.keyframes[this.nextKeyframe].translate[0] - this.keyframes[this.currentKeyframe].translate[0])*(delta_t - this.keyframes[this.currentKeyframe].instant)/(this.keyframes[this.nextKeyframe].instant - this.keyframes[this.currentKeyframe].instant) + this.keyframes[this.currentKeyframe].translate[0];
            var translate_y = (this.keyframes[this.nextKeyframe].translate[1] - this.keyframes[this.currentKeyframe].translate[1])*(delta_t - this.keyframes[this.currentKeyframe].instant)/(this.keyframes[this.nextKeyframe].instant - this.keyframes[this.currentKeyframe].instant) + this.keyframes[this.currentKeyframe].translate[1];
            var translate_z = (this.keyframes[this.nextKeyframe].translate[2] - this.keyframes[this.currentKeyframe].translate[2])*(delta_t - this.keyframes[this.currentKeyframe].instant)/(this.keyframes[this.nextKeyframe].instant - this.keyframes[this.currentKeyframe].instant) + this.keyframes[this.currentKeyframe].translate[2];
            
            var coordinates = [translate_x, translate_y, translate_z];
            this.animMatrix = mat4.translate(this.animMatrix, this.animMatrix, coordinates);

            // Rotate
            var rotate_x = (this.keyframes[this.nextKeyframe].rotate[0] - this.keyframes[this.currentKeyframe].rotate[0])*(delta_t - this.keyframes[this.currentKeyframe].instant)/(this.keyframes[this.nextKeyframe].instant - this.keyframes[this.currentKeyframe].instant) + this.keyframes[this.currentKeyframe].rotate[0];
            var rotate_y = (this.keyframes[this.nextKeyframe].rotate[1] - this.keyframes[this.currentKeyframe].rotate[1])*(delta_t - this.keyframes[this.currentKeyframe].instant)/(this.keyframes[this.nextKeyframe].instant - this.keyframes[this.currentKeyframe].instant) + this.keyframes[this.currentKeyframe].rotate[1];
            var rotate_z = (this.keyframes[this.nextKeyframe].rotate[2] - this.keyframes[this.currentKeyframe].rotate[2])*(delta_t - this.keyframes[this.currentKeyframe].instant)/(this.keyframes[this.nextKeyframe].instant - this.keyframes[this.currentKeyframe].instant) + this.keyframes[this.currentKeyframe].rotate[2];

            this.animMatrix = mat4.rotateX(this.animMatrix, this.animMatrix, rotate_x*Math.PI/180);
            this.animMatrix = mat4.rotateY(this.animMatrix, this.animMatrix, rotate_y*Math.PI/180);
            this.animMatrix = mat4.rotateZ(this.animMatrix, this.animMatrix, rotate_z*Math.PI/180);

            // Scale
            var n_all = (this.keyframes[this.nextKeyframe].instant - this.keyframes[this.currentKeyframe].instant)/(t-this.previous_t);
            var n = (delta_t - this.keyframes[this.currentKeyframe].instant)/(t-this.previous_t);

            var scale_x = this.keyframes[this.currentKeyframe].scale[0]*Math.pow(Math.pow(this.keyframes[this.nextKeyframe].scale[0]/this.keyframes[this.currentKeyframe].scale[0], 1/n_all),n);
            var scale_y = this.keyframes[this.currentKeyframe].scale[1]*Math.pow(Math.pow(this.keyframes[this.nextKeyframe].scale[1]/this.keyframes[this.currentKeyframe].scale[1], 1/n_all),n);
            var scale_z = this.keyframes[this.currentKeyframe].scale[2]*Math.pow(Math.pow(this.keyframes[this.nextKeyframe].scale[2]/this.keyframes[this.currentKeyframe].scale[2], 1/n_all),n);

            coordinates = [scale_x, scale_y, scale_z];
            this.animMatrix = mat4.scale(this.animMatrix, this.animMatrix, coordinates);

            this.previous_t = t;
        }
    }

    apply(scene){
        scene.multMatrix(this.animMatrix);
    }
}


