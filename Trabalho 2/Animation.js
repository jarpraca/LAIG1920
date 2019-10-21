/**
* Animation
* @constructor
*/
class Animation {
    constructor(scene, id) {
        super(scene);

        this.id=id;

        this.initBuffers();
    }

    update();

    apply();
}


