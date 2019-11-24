/**
 * MySecurityCamera
 */
class MySecurityCamera extends CGFobject {
	constructor(scene, texture) {
                super(scene);
                this.texture = texture;
                this.initBuffers();
	}
	
	initBuffers() {
                this.rectangle = new MyRectangle(this.scene, 'security', 0,5,-5,0);
        }

        display(){
                this.scene.pushMatrix();
                this.texture.bind();
                this.rectangle.display();
                this.texture.unbind();
                this.scene.popMatrix();
        }

}

