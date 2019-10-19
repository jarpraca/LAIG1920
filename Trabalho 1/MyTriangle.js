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
		this.z1 = 0;
		this.x2 = x2;
		this.y2 = y2;
		this.z2 = 0;
		this.x3 = x3;
		this.y3 = y3;
		this.z3 = 0;
		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [
			this.x1, this.y1, this.z1,	//0
			this.x2, this.y2, this.z2,	//1
			this.x3, this.y3, this.z3	//2
		];
		
		//Counter-clockwise reference of vertices
		this.indices = [
			0, 2, 1
		];

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		]

		this.a = Math.sqrt(Math.pow(this.x2 - this.x3,2) + Math.pow(this.y2 - this.y3,2) + Math.pow(this.z2 - this.z3,2));
		this.b = Math.sqrt(Math.pow(this.x3 - this.x1,2) + Math.pow(this.y3 - this.y1,2) + Math.pow(this.z3 - this.z1,2));
		this.c = Math.sqrt(Math.pow(this.x2 - this.x1,2) + Math.pow(this.y2 - this.y1,2) + Math.pow(this.z2 - this.z1,2));

		this.cosB = (this.a*this.a - this.b*this.b + this.c*this.c)/(2*this.a*this.c);
		this.sinB = Math.sin(Math.acos(this.cosB));
		/*
		this.texCoords = [			
			0, 1,
			c, 1,
			c - a*cosB, 1 - a*sinB,
			0, 1,
			c, 1,
			c - a*cosB, 1 - a*sinB
		]*/
		this.updateTexCoords(1,1);
		
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
	updateTexCoords(s, t) {
		this.texCoords = [
            (this.c - this.a * this.cos_beta)/s, (t - this.a * this.sin_beta) / t,
            0, 1,
            this.c / s, 1
        ];
		this.updateTexCoordsGLBuffers();
	}
}

