/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - id of the object
 * @param slices - number of slices
 * @param stacks - number of stacks
 * @param radius - radius of the sphere
*/
class MySphere extends CGFobject {
    constructor(scene, id, slices, stacks, radius) {
        super(scene);
        this.id = id;
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
        var theta = Math.PI/2; //stacks
        var inc_alpha = 2*Math.PI/this.slices; //slices
        var inc_theta = Math.PI/(this.stacks*2); //stacks

        // First pole
        for(var i=0; i <= this.slices;i++){
            this.vertices.push(0, 0, this.radius);
            this.normals.push(0, 0, 1);
            this.texCoords.push(i/this.slices, 0);
        }

        theta+=inc_theta;

        // First stack
        for(var i = 0; i < this.slices; i++){
            this.vertices.push(this.radius*Math.cos(theta)*Math.cos(alpha), this.radius*Math.cos(theta)*Math.sin(alpha), this.radius*Math.sin(theta));
            this.normals.push(Math.cos(theta)*Math.cos(alpha), Math.cos(theta)*Math.sin(alpha), Math.sin(theta));
            this.texCoords.push(i/this.slices, 1/(this.stacks*2));

            var a = this.slices + 1 + i;
            this.indices.push(a, a+1, i);

            alpha+=inc_alpha;
        }

        // Last vertice of the first stack
        this.vertices.push(this.radius*Math.cos(theta)*Math.cos(alpha), this.radius*Math.cos(theta)*Math.sin(alpha), this.radius*Math.sin(theta));
        this.normals.push(Math.cos(theta)*Math.cos(alpha), Math.cos(theta)*Math.sin(alpha), Math.sin(theta));
        this.texCoords.push(1, 1/(this.stacks*2));

        // Remainder stacks
        for(var j = 2; j < (this.stacks*2); j++){
            alpha = 0;
            theta+=inc_theta;

            for(var i = 0; i < this.slices; i++){

                this.vertices.push(this.radius*Math.cos(theta)*Math.cos(alpha), this.radius*Math.cos(theta)*Math.sin(alpha), this.radius*Math.sin(theta));
                this.normals.push(Math.cos(theta)*Math.cos(alpha), Math.cos(theta)*Math.sin(alpha), Math.sin(theta));
                this.texCoords.push(i/this.slices, j/(this.stacks*2));

                var a = j*(this.slices+1)+i;
                this.indices.push(a, a+1, a-this.slices);
                this.indices.push(a, a-this.slices, a-this.slices-1);
                
                alpha+=inc_alpha;
            }

            // Last vertice of the stack
            this.vertices.push(this.radius*Math.cos(theta)*Math.cos(alpha), this.radius*Math.cos(theta)*Math.sin(alpha), this.radius*Math.sin(theta));
            this.normals.push(Math.cos(theta)*Math.cos(alpha), Math.cos(theta)*Math.sin(alpha), Math.sin(theta));
            this.texCoords.push(1, j/(this.stacks*2));
        }

        // Last stack; Second pole
        for(var i=0; i < this.slices;i++){
            this.vertices.push(0, 0, -this.radius);
            this.normals.push(0, 0, -1);
            this.texCoords.push(i/this.slices, 1);

            var a = (this.slices+1)*(this.stacks*2)+i;
            this.indices.push(a, a-this.slices, a-this.slices-1);
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


