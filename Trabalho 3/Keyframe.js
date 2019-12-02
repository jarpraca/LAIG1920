/**
 * Keyframe
 * @constructor
 * @param instant - instant of the keyframe
 */
class Keyframe {
    constructor(instant) {
        this.instant = instant;

        this.translate = [0,0,0];
        this.rotate = [0,0,0];
        this.scale = [1,1,1];
    }

    addTranslate(translate){
        this.translate = translate;
    }

    addRotate(rotate){
        this.rotate = rotate;
    }

    addScale(scale){
        this.scale = scale;
    }
}


