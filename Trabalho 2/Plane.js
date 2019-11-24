/**
 * Plane (using NURBS)
 * @constructor
 * @param scene - Reference to MyScene object
 * @param npartsU - Divisions in U
 * @param npartsV - Divisions in V
 */
class Plane extends CGFobject {
	constructor(scene, id, npartsU, npartsV) {
		super(scene);
		this.id = id;
		this.npartsU = npartsU;
		this.npartsV = npartsV;

		this.initBuffers();
	}
	
	initBuffers() {
		var controlvertexes = [	// U = 0
								[ // V = 0..1;
									[-0.5, 0.0, 0.5, 1 ],
									[-0.5,  0.0, -0.5, 1 ]
									
								],
								// U = 1
								[ // V = 0..1
									[ 0.5, 0.0, 0.5, 1 ],
									[ 0.5,  0.0, -0.5, 1 ]							 
								]
							];

		var nurbsSurface = new CGFnurbsSurface(1, 1, controlvertexes);

		this.nurbsObj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	}

	display(){
		this.nurbsObj.display();
	}
}