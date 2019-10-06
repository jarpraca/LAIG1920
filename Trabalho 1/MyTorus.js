/**
* MyTorus
* @constructor
*/
class MyTorus extends CGFobject {
    constructor(scene, id, slices, loops, inner, outer) {
        super(scene);
        this.slices = slices;
        this.loops = loops;
        this.inner = inner;
        this.outer = outer;
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var theta = 0; //slices
        var alpha = 0; //loops
        var inc_theta = 2*Math.PI/this.slices; //slices
        var inc_alpha = 2*Math.PI/this.loops; //loops

        // First vertices ("loop 0")
        for(var i = 0; i <= this.slices; i++){

            this.vertices.push((this.outer+this.inner*Math.cos(theta))*Math.cos(alpha), (this.outer+this.inner*Math.cos(theta))*Math.sin(alpha), this.inner*Math.sin(theta));
            this.normals.push(Math.cos(theta)*Math.cos(alpha), Math.cos(theta)*Math.sin(alpha), Math.sin(theta));
            this.texCoords.push(0, 1-i/this.slices);

            theta+=inc_theta;
        }

        // Remainder vertices
        for(var j = 1; j <= this.loops; j++){
            theta = 0;
            alpha+=inc_alpha;

            for(var i= 0; i < this.slices; i++){

                this.vertices.push((this.outer+this.inner*Math.cos(theta))*Math.cos(alpha), (this.outer+this.inner*Math.cos(theta))*Math.sin(alpha), this.inner*Math.sin(theta));
                this.normals.push(Math.cos(theta)*Math.cos(alpha), Math.cos(theta)*Math.sin(alpha), Math.sin(theta));
                this.texCoords.push(j/this.loops, 1-i/this.slices);

                var a = (j-1)*(this.slices+1)+i;

                this.indices.push(a, a+1, a+this.slices+2);
                this.indices.push(a, a+this.slices+2, a+this.slices+1);
                
                theta+=inc_theta;
            }
            
            this.vertices.push((this.outer+this.inner*Math.cos(theta))*Math.cos(alpha), (this.outer+this.inner*Math.cos(theta))*Math.sin(alpha), this.inner*Math.sin(theta));
            this.normals.push(Math.cos(theta)*Math.cos(alpha), Math.cos(theta)*Math.sin(alpha), Math.sin(theta));
            this.texCoords.push(j/this.loops, 1);
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


