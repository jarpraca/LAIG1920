/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTriangle extends CGFobject {
	
	constructor(scene, id, x1, y1, x2, y2, x3, y3) {
		super(scene);
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.x3 = x3;
		this.y3 = y3;
		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y2, 0,	//1
			this.x3, this.y3, 0,	//2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2
		];

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		]
		
		this.texCoords = [			
			0, 1,
			1, 1,
			0, 0
		]
		
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
	updateBuffers(){
        this.initBuffers();
        this.initNormalVizBuffers();
	}
	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the quad
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}

