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

        // First vertices ("stack 0")
        for(var i = 0; i <= this.slices; i++){
            var sa=Math.sin(ang);
            var ca=Math.cos(ang);

            this.vertices.push(ca*radius, sa*radius, 0);
            this.normals.push(ca, sa, this.height/Math.abs(this.radiusBottom-this.radiusTop));
            this.texCoords.push(i/this.slices, 1);

            ang+=alphaAng;
        }

        // Remainder vertices
        for(var j = 1; j <= this.stacks; j++){
            ang = 0;
            radius+=inc_radius;
            var sa;
            var ca;

            for(var i= 0; i < this.slices; i++){
                sa=Math.sin(ang);
                ca=Math.cos(ang);

                this.vertices.push(ca*radius, sa*radius, inc_height*j);
                this.normals.push(ca, sa, this.height/Math.abs(this.radiusBottom-this.radiusTop));
                this.texCoords.push(i/this.slices, 1 - inc_height*j);

                var a = (j-1)*(this.slices+1)+i;

                this.indices.push(a, a+1, a+this.slices+2);
                this.indices.push(a, a+this.slices+2, a+this.slices+1);
                
                ang+=alphaAng;
            }

            sa=Math.sin(ang);
            ca=Math.cos(ang);

            this.vertices.push(ca*radius, sa*radius, inc_height*j);
            this.normals.push(ca, sa, this.height/Math.abs(this.radiusBottom-this.radiusTop));
            this.texCoords.push(1, 1 - inc_height*j);
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


