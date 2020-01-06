/**
 * MyCameraAnimate
 */
class MyCameraAnimate {
    constructor(scene, initialCamera, finalCamera, duration) {
        this.scene = scene;
        this.duration = duration;
        this.initialCamera = initialCamera;
        this.finalCamera = finalCamera;

        this.finished = false;
        this.initial_time = 0;
        this.previous_t = 0;
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

        let near = (this.finalCamera.near - this.initialCamera.near) * delta / this.duration + this.initialCamera.near;
        let far = delta * (this.finalCamera.far - this.initialCamera.far) / this.duration + this.initialCamera.far;
        
        let positionX = (this.finalCamera.position[0] - this.initialCamera.position[0]) * delta/ this.duration + this.initialCamera.position[0];
        let positionY = (this.finalCamera.position[1] - this.initialCamera.position[1]) * delta/ this.duration + this.initialCamera.position[1];
        let positionZ = (this.finalCamera.position[2] - this.initialCamera.position[2]) * delta/ this.duration + this.initialCamera.position[2];
        
        let targetX = (this.finalCamera.target[0] - this.initialCamera.target[0]) * delta/ this.duration + this.initialCamera.target[0];
        let targetY = (this.finalCamera.target[1] - this.initialCamera.target[1]) * delta/ this.duration + this.initialCamera.target[1];
        let targetZ = (this.finalCamera.target[2] - this.initialCamera.target[2]) * delta/ this.duration + this.initialCamera.target[2];

        let camera = new CGFcamera(this.initialCamera.fov, near, far, vec3.fromValues(positionX, positionY, positionZ), vec3.fromValues(targetX, targetY, targetZ));
        this.scene.interface.setActiveCamera(camera);
        this.scene.camera = camera;
    }
}