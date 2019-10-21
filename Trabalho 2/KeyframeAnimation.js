/**
* KeyframeAnimation
* @constructor
*/
class KeyframeAnimation extends Animation {
    constructor(scene, id) {
        super(scene);

        this.id=id;

        this.initBuffers();
    }

    update();

    apply();
}


