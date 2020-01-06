/**
 * MyCameraRotate
 */
class MyCameraRotate {
    constructor(scene, angle, initialTarget, finalTarget, duration) {
        this.scene = scene;
        this.angle = angle;
        this.initialTarget = initialTarget;
        this.finalTarget = finalTarget;
        this.duration = duration;
        this.total = 0;

        this.finished = false;
        this.initial_time = 0;
        this.previous_t = 0;
    }

    update(time) {
        let t = time / 1000;

        if (this.initial_time == 0) {
            this.initial_time = t;
            this.previous_t = t;
        }

        let delta1 = t - this.initial_time;
        let delta2 = t - this.previous_t;

        if (delta1 > this.duration) {
            this.finished = true;
            delta1 = this.duration;
        }

        let angle = this.angle * delta2 / this.duration;
        this.total += angle;

        if ( this.total > this.angle) {
            this.total -= angle;
            angle = this.angle - this.total;
            this.finished = true;
        }

        let x = (this.finalTarget[0] - this.initialTarget[0]) * delta1 / this.duration;
        let y = (this.finalTarget[1] - this.initialTarget[1]) * delta1 / this.duration;
        let z = (this.finalTarget[2] - this.initialTarget[2]) * delta1 / this.duration;

        this.scene.camera.setTarget([0, 0, 0]);
        this.scene.camera.orbit(CGFcameraAxis.Y, angle);
        this.scene.camera.setTarget([x, y, z]);
        // this.scene.interface.setActiveCamera(camera);
        this.previous_t = t;
    }
}