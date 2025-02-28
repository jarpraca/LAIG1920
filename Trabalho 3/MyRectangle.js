/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - id of the object
 * @param x1 - x coordinate of point 1
 * @param x2 - x coordinate of point 2
 * @param y1 - y coordinate of point 1
 * @param y2 - y coordinate of point 2
 */
class MyRectangle extends CGFobject {
	constructor(scene, id, x1, x2, y1, y2) {
		super(scene);
        this.id = id;
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y1, 0,	//1
			this.x1, this.y2, 0,	//2
			this.x2, this.y2, 0		//3
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			1, 3, 2
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];
		
		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

		this.texCoords = [
			0, 1,
			1, 1,
			0, 0,
			1, 0,
			0, 1,
			1, 1,
			0, 0,
			1, 0
		]
		//this.updateTexCoords(Math.abs(this.y2 - this.y1),Math.abs(this.y2 - this.y1));
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(s,t) {
		this.texCoords = [
			0, Math.abs(this.y2 - this.y1)/ t,
			0, 0,
			Math.abs(this.x2 - this.x1) / s, 0,
			Math.abs(this.x2 - this.x1) / s, Math.abs(this.y2 - this.y1)/ t
		];

		this.updateTexCoordsGLBuffers();
	}
}

