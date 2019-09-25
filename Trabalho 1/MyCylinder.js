/**
* MyCylinder
* @constructor
*/
class MyCylinder extends CGFobject {
    constructor(scene, id, slices, stacks, radiusBottom, radiusTop, height) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.radiusBottom = radiusBottom;
        this.radiusTop = radiusTop;
        this.height = height;
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var ang = 0;
        var alphaAng = 2*Math.PI/this.slices;
        var inc_height = this.height/this.stacks;
        var inc_radius = (this.radiusTop - this.radiusBottom)/this.stacks;
        var radius = this.radiusBottom;

        for(var i = 0; i < this.slices; i++){
            var sa=Math.sin(ang);
            var ca=Math.cos(ang);

            this.vertices.push(ca*radius, sa*radius, 0);
            this.normals.push(ca*radius, sa*radius, this.height/(this.radiusBottom-this.radiusTop));
            ang+=alphaAng;
        }

        for(var j = 1; j <= this.stacks; j++){
            ang = 0;
            radius+=inc_radius;
            for(var i= 0; i < this.slices; i++){
                var sa=Math.sin(ang);
                var ca=Math.cos(ang);

                this.vertices.push(ca*radius, sa*radius, inc_height*j);
                this.normals.push(ca*radius, sa*radius, this.height/(this.radiusBottom-this.radiusTop));

                var a = (j-1)*this.slices+i;
                if(i == this.slices - 1){
                    this.indices.push(a, a+1-this.slices, a+1);
                    this.indices.push(a, a+1, a+this.slices);
                }
                else{
                    this.indices.push(a, a+1, a+this.slices+1);
                    this.indices.push(a, a+this.slices+1, a+this.slices);
                }
                
                ang+=alphaAng;
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
    updateBuffers(complexity){
        this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}


