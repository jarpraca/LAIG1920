/**
 * MyCylinder2 (using NURBS)
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - id of the object
 * @param slices - number of slices
 * @param stacks - number of stacks
 * @param radiusBottom - radius of the cylinder's bottom
 * @param radiusTop - radius of the cylinder's top
 * @param height - cylinder's height
*/
class MyCylinder2 extends CGFobject {
    constructor(scene, id, slices, stacks, radiusBottom, radiusTop, height) {
        super(scene);
        this.id = id;
        this.slices = slices;
        this.stacks = stacks;
        this.radiusBottom = radiusBottom;
        this.radiusTop = radiusTop;
        this.height = height;
        this.initBuffers();
    }

    initBuffers() {
        var controlvertexes1 = [// U = 0
                                [ // V = 0..1;
                                    [-this.radiusBottom, 0.0, 0.0, 1 ],
                                    [-this.radiusTop, 0.0, this.height, 1 ]	
                                ],
                                // U = 1
                                [ // V = 0..1
                                    [-this.radiusBottom, -this.radiusBottom*4/3, 0.0, 1 ],
                                    [-this.radiusTop, -this.radiusTop*4/3, this.height, 1 ]	
                                ],
                                // U = 2
                                [ // V = 0..1
                                    [ this.radiusBottom, -this.radiusBottom*4/3, 0.0, 1 ],
                                    [ this.radiusTop, -this.radiusTop*4/3, this.height, 1 ]							 
                                ],
                                // U = 3
                                [ // V = 0..1
                                    [ this.radiusBottom, 0.0, 0.0, 1 ],
                                    [ this.radiusTop, 0.0, this.height, 1 ]						 
                                ]
                            ];
        
        this.half1 = new Patch(this.scene, this.id, 4, 2, this.slices, this.stacks, controlvertexes1);

        var controlvertexes2 = [// U = 0
                                [ // V = 0..1;
                                    [ this.radiusBottom, 0.0, 0.0, 1 ],
                                    [ this.radiusTop, 0.0, this.height, 1 ]	
                                ],
                                // U = 1
                                [ // V = 0..1
                                    [ this.radiusBottom, this.radiusBottom*4/3, 0.0, 1 ],
                                    [ this.radiusTop, this.radiusTop*4/3, this.height, 1 ]
                                ],
                                // U = 2
                                [ // V = 0..1
                                    [-this.radiusBottom, this.radiusBottom*4/3, 0.0, 1 ],
                                    [-this.radiusTop, this.radiusTop*4/3, this.height, 1 ]									 
                                ],
                                // U = 3
                                [ // V = 0..1
                                    [-this.radiusBottom, 0.0, 0.0, 1 ],
                                    [-this.radiusTop, 0.0, this.height, 1 ]						 
                                ]
                            ];

        this.half2 = new Patch(this.scene, this.id, 4, 2, this.slices, this.stacks, controlvertexes2);
    }

    display(){
        this.half1.display();
        this.half2.display();
    }
}
