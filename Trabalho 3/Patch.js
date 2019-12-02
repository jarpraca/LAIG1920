/**
 * Patch
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - id of the object
 * @param npointsU - number of points in U
 * @param npointsV - number of points in V
 * @param npartsU - divisions in U
 * @param npartsV - divisions in V
 * @param controlvertexes - points of the NURB surface
 */
class Patch extends CGFobject {
	constructor(scene, id, npointsU, npointsV, npartsU, npartsV, controlvertexes) {
		super(scene);
        this.id = id;
        this.npointsU = npointsU;
        this.npointsV = npointsV;
		this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.controlvertexes = controlvertexes;

		this.initBuffers();
	}
	
	initBuffers() {
		var nurbsSurface = new CGFnurbsSurface(this.npointsU-1, this.npointsV-1, this.controlvertexes);

		this.nurbsObj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	}

	display(){
		this.nurbsObj.display();
	}
}