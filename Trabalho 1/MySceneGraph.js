var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
            console.log(i + "nodeName: " + nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <globals>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <globals> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <globals> out of order");

            //Parse globals block
            if ((error = this.parseGlobals(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {

        this.views = [];
        
        if (viewsNode.nodeName != "views")
            return "root tag <views> missing";

        this.defaultID = this.reader.getString(viewsNode,'default');

        this.defaultView;

        this.children = viewsNode.children;

        var grandChildren;

        if(this.children.length == 0)
            return "No views created";

        for (var i = 0; i < this.children.length; i++) {

            if (this.children[i].nodeName != "perspective") {
                this.onXMLMinorError("unknown tag <" + this.children[i].nodeName + ">");
                continue;
            }

            // Get id of the current view.
            var viewID = this.reader.getString(this.children[i], 'id');
            if (viewID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.views[viewID] != null)
                return "ID must be unique for each light (conflict: ID = " + viewID + ")";

            var near = this.reader.getFloat(this.children[i], 'near');
            var far = this.reader.getFloat(this.children[i], 'far');
            var angle = this.reader.getFloat(this.children[i], 'angle');

            grandChildren = this.children[i].children;

            if (grandChildren[0].nodeName != "from") {
                this.onXMLMinorError("unknown tag <" + grandChildren[0].nodeName + ">");
                continue;
            }
            else{
                var x_from = this.reader.getFloat(grandChildren[0], 'x');
                var y_from = this.reader.getFloat(grandChildren[0], 'y');
                var z_from = this.reader.getFloat(grandChildren[0], 'z');
            }

            if (grandChildren[1].nodeName != "to") {
                this.onXMLMinorError("unknown tag <" + grandChildren[1].nodeName + ">");
                continue;
            }
            else{
                var x_to = this.reader.getFloat(grandChildren[1], 'x');
                var y_to = this.reader.getFloat(grandChildren[1], 'y');
                var z_to = this.reader.getFloat(grandChildren[1], 'z');
            }

            var camera = new CGFcamera(angle*Math.PI/180, near, far, vec3.fromValues(x_from, y_from, z_from), vec3.fromValues(x_to, y_to, z_to));

            if(viewID == this.defaultID){
                this.defaultCamera = camera;
            }

            this.views[viewID] = camera;
        }

        return null;
    }


    /**
     * Parses the <globals> node.
     * @param {globals block element} globalsNode
     */
    parseGlobals(globalsNode) {

        var children = globalsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || 1;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        var children = texturesNode.children;

        this.textures = [];

        // Any number of textures.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current texture.
            var textureID = this.reader.getString(children[i], 'id');
            if (textureID == null){
                return "no ID defined for texture";
            }

            // Checks for repeated IDs.
            if (this.textures[textureID] != null){
                return "ID must be unique for each light (conflict: ID = " + textureID + ")";
            }


            var texture = new CGFtexture(this.scene, this.reader.getString(children[i], 'file'));

            this.textures[textureID] = texture;
        }

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";


            this.material = new CGFappearance(this.scene);

            this.material.setShininess(this.reader.getFloat(children[i], 'shininess'));

            grandChildren = children[i].children;

            if (grandChildren[0].nodeName != "emission") {
                this.onXMLMinorError("unknown tag <" + grandChildren[0].nodeName + ">");
                continue;
            }
            else{
                this.material.setEmission(this.reader.getFloat(grandChildren[0], 'r'),
                                        this.reader.getFloat(grandChildren[0], 'g'),
                                        this.reader.getFloat(grandChildren[0], 'b'),
                                        this.reader.getFloat(grandChildren[0], 'a'));                                  
            }

            if (grandChildren[1].nodeName != "ambient") {
                this.onXMLMinorError("unknown tag <" + grandChildren[1].nodeName + ">");
                continue;
            }
            else{
                this.material.setAmbient(this.reader.getFloat(grandChildren[1], 'r'),
                                        this.reader.getFloat(grandChildren[1], 'g'),
                                        this.reader.getFloat(grandChildren[1], 'b'),
                                        this.reader.getFloat(grandChildren[1], 'a'));                                  
            }

            if (grandChildren[2].nodeName != "diffuse") {
                this.onXMLMinorError("unknown tag <" + grandChildren[2].nodeName + ">");
                continue;
            }
            else{
                this.material.setDiffuse(this.reader.getFloat(grandChildren[2], 'r'),
                                        this.reader.getFloat(grandChildren[2], 'g'),
                                        this.reader.getFloat(grandChildren[2], 'b'),
                                        this.reader.getFloat(grandChildren[2], 'a'));                                  
            }

            if (grandChildren[3].nodeName != "specular") {
                this.onXMLMinorError("unknown tag <" + grandChildren[3].nodeName + ">");
                continue;
            }
            else{
                this.material.setSpecular(this.reader.getFloat(grandChildren[3], 'r'),
                                        this.reader.getFloat(grandChildren[3], 'g'),
                                        this.reader.getFloat(grandChildren[3], 'b'),
                                        this.reader.getFloat(grandChildren[3], 'a'));                                  
            }

            this.materials[materialID] = this.material;
        }

        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();

            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':                        
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'rotate':
                        var axis = this.reader.getString(grandChildren[j], 'axis');
                        var angle = this.reader.getString(grandChildren[j], 'angle');

                        switch(axis){
                            case 'x':
                                transfMatrix = mat4.rotateX(transfMatrix, transfMatrix, angle*Math.PI/180);
                                break;
                            case 'y':
                                transfMatrix = mat4.rotateY(transfMatrix, transfMatrix, angle*Math.PI/180);
                                break;
                            case 'z':
                                transfMatrix = mat4.rotateZ(transfMatrix, transfMatrix, angle*Math.PI/180);
                                break;
                        }
                        break;
                }
            }
            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            }
            else if (primitiveType == 'triangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(y2 != null && !isNaN(x3)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y2 != null && !isNaN(y3)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var tri = new MyTriangle(this.scene, primitiveId, x1, y1, x2, y2, x3, y3);

                this.primitives[primitiveId] = tri;
            }
            
            else if (primitiveType == 'cylinder') {
                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(/*slices != null && */!isNaN(slices)/* && slices >= 1*/))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(/*stacks != null && */!isNaN(stacks)/* && stacks >= 1*/))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                // top
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(/*top != null &&*/ !isNaN(top)/* && top > 0*/))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                // bottom
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(/*base != null && */!isNaN(base)/* && base > 0*/))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                // height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(/*height != null &&*/ !isNaN(height)/* && height > 0*/))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var cylinder = new MyCylinder(this.scene, primitiveId, slices, stacks, base, top, height);

                this.primitives[primitiveId] = cylinder;
            }

            else if (primitiveType == 'sphere') {
                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices) && slices >= 1))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks) && stacks >= 1))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                // radius
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius) && radius > 0))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var sphere = new MySphere(this.scene, primitiveId, slices, stacks, radius);

                this.primitives[primitiveId] = sphere;
            }

            else if (primitiveType == 'torus') {
                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices) && slices >= 1))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // loops
                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops) && loops >= 1))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                // inner
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner) && inner > 0))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                // outer
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer) && outer > 0))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var torus = new MyTorus(this.scene, primitiveId, slices, loops, inner, outer);

                this.primitives[primitiveId] = torus;
            }
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");

            // Transformations

            var Ctransformations = grandChildren[transformationIndex].children;

            var transfMatrix = mat4.create();

            for (var j = 0; j < Ctransformations.length; j++) {
                switch (Ctransformations[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(Ctransformations[j]);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':                        
                        var coordinates = this.parseCoordinates3D(Ctransformations[j]);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'rotate':
                        var axis = this.reader.getString(Ctransformations[j], 'axis');
                        var angle = this.reader.getString(Ctransformations[j], 'angle');

                        switch(axis){
                            case 'x':
                                transfMatrix = mat4.rotateX(transfMatrix, transfMatrix, angle*Math.PI/180);
                                break;
                            case 'y':
                                transfMatrix = mat4.rotateY(transfMatrix, transfMatrix, angle*Math.PI/180);
                                break;
                            case 'z':
                                transfMatrix = mat4.rotateZ(transfMatrix, transfMatrix, angle*Math.PI/180);
                                break;
                        }
                        break;
                    case 'transformationref':
                        mat4.multiply(transfMatrix, transfMatrix, this.transformations[this.reader.getString(Ctransformations[j], 'id')]);
                        break;
                }
            }

            // Materials

            var Cmaterials = grandChildren[materialsIndex].children;

            var materialIDs = [];

            for (var j = 0; j < Cmaterials.length; j++) {
                materialIDs[j] = this.reader.getString(Cmaterials[j], 'id');
            }

            // Texture

            var Ctexture = grandChildren[textureIndex];

            var textureID = this.reader.getString(Ctexture, 'id');

            var length_s;
            var length_t;

            if(textureID == "none" || textureID == "inherit"){
                length_s = 0;
                length_t = 0;
            }
            else {
                length_s = this.reader.getString(Ctexture, 'length_s');
                length_t = this.reader.getString(Ctexture, 'length_t');

                if(length_s == null)
                    length_s = 0;
                
                if(length_t == null)
                    length_t = 0;

                console.log(length_s);
            }

            // Children

            var grandgrandChildren = grandChildren[childrenIndex].children;

            var componentIDs = [];
            var primitiveIDs = [];

            for (var j = 0; j < grandgrandChildren.length; j++) {
                if(grandgrandChildren[j].nodeName == "componentref")
                    componentIDs.push(this.reader.getString(grandgrandChildren[j], 'id'));
                else if(grandgrandChildren[j].nodeName == "primitiveref")
                    primitiveIDs.push(this.reader.getString(grandgrandChildren[j], 'id'));
            }

            var component = new MyComponent(this.scene, componentID, transfMatrix, materialIDs, textureID, length_s, length_t, componentIDs, primitiveIDs);

            this.components[componentID] = component;
        }
        this.log("Parsed components");
        return null;
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }


    parseTree(componentID, textureID, materialID, length_s, length_t){

        // Transformations
        this.scene.pushMatrix();
        this.scene.multMatrix(this.components[componentID].transformations);
        
        // Material
        var newMaterialID;

        if(this.components[componentID].materials[0] == "inherit"){
            newMaterialID = materialID;
        }
        else
            newMaterialID = this.components[componentID].materials[0];
        
        this.materials[newMaterialID].apply();

        // Texture
        var newTextureID;
        var newLength_s = 0;
        var newLength_t = 0;

        if(this.components[componentID].texture == "inherit"){
            newTextureID = textureID;
            newLength_s = length_s;
            newLength_t = length_t;
        }
        else{
            newTextureID = this.components[componentID].texture;
            newLength_s = this.components[componentID].length_s;
            newLength_t = this.components[componentID].length_t;
        }

        if(newTextureID == "none"){
            this.materials[newMaterialID].setTexture(null);
        }
        else{
            this.materials[newMaterialID].setTexture(this.textures[newTextureID]);
        }

        // Children
        for(var i=0; i < this.components[componentID].components.length; i++){
            this.parseTree(this.components[componentID].components[i], newTextureID, newMaterialID, newLength_s, newLength_t);
        }

        for(var i=0; i < this.components[componentID].primitives.length; i++){
            if(newTextureID != "none" && 
                (this.primitives[this.components[componentID].primitives[i]] instanceof MyRectangle || this.primitives[this.components[componentID].primitives[i]] instanceof MyTriangle))
            {
                this.primitives[this.components[componentID].primitives[i]].updateTexCoords(newLength_s, newLength_t);
            }

            this.primitives[this.components[componentID].primitives[i]].display();
        }

        this.scene.popMatrix();
        return;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        //To do: Create display loop for transversing the scene graph

        if(this.components[this.idRoot] == null){
            console.log("Root component is null");
            return null;
        }

        this.parseTree(this.idRoot, "none", "none", 0, 0);

        //To test the parsing/creation of the primitives, call the display function directly
        //this.scene.pushMatrix();
        //this.scene.translate(2,1,-1);
        //this.scene.rotate(-Math.PI/2, 1, 0, 0);
        //this.primitives['rectangle'].display();
        //this.primitives['triangle_wheel_back'].display();
        //this.primitives['cylinder_main'].display();
        //this.primitives['sphere'].display();
        //this.primitives['torus_engine'].display();
        //this.primitives['triangle_wing_back'].display();
        //this.scene.popMatrix();
    }
}