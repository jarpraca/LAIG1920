/**
* MySphere
* @constructor
*/
class MySphere extends CGFobject {
    constructor(scene, id, slices, stacks, radius) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.radius = radius;
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var alpha = 0; //slices
        var theta = 0; //stacks
        var inc_alpha = 2*Math.PI/this.slices; //slices
        var inc_theta = (Math.PI/2)/this.stacks; //stacks

        //first vertice
        this.vertices.push(0, 0, this.radius);
        this.normals.push(0, 0, 1);

        theta+=inc_theta;
        for(var i = 0; i < this.slices; i++){
            this.vertices.push(this.radius*Math.cos(alpha)*Math.cos(theta), this.radius*Math.cos(theta)*Math.sin(alpha), this.radius*Math.sin(theta));
            this.normals.push(Math.cos(alpha)*Math.cos(theta), Math.cos(theta)*Math.sin(alpha), Math.sin(theta));

            this.indices.push(i+1, i+2, 0);

            alpha+=inc_alpha;
        }

        for(var j = 1; j < this.stacks; j++){
            alpha = 0;
            for(var i = 0; i < this.slices; i++){

                this.vertices.push(this.radius*Math.cos(alpha)*Math.cos(theta), this.radius*Math.cos(theta)*Math.sin(alpha), this.radius*Math.sin(theta));
                this.normals.push(Math.cos(alpha)*Math.cos(theta), Math.cos(theta)*Math.sin(alpha), Math.sin(theta));

                this.indices.push(j*this.slices+i+1, j*this.slices+i+2, j*this.slices+i+2-this.slices);
                this.indices.push(j*this.slices+i+1, j*this.slices+i+2-this.slices, j*this.slices+i+1-this.slices);
                
                alpha+=inc_alpha;
            }
            theta+=inc_theta;
        }

        //last vertice
        /*
        this.vertices.push(0, 0, -this.radius);
        this.normals.push(0, 0, -1);*/

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


