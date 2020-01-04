/**
 * MyGameOrchestrator
 * @constructor
 * @param scene - Reference to MyScene object
 * @param filename - name of XML scene
 * @param piece - piece moved
 * @param originTile - origin tile
 * @param destinationTile - destination tile
 * @param initialGameboard - gameboard before move
*/
class MyGameOrchestrator {
    constructor(scene, filename) {
        this.scene = scene;
        this.gameboard = new MyGameboard(this.scene, 'gameboard');
        //this.theme = new MySceneGraph(filename, this.scene);
        this.prolog;
    }

    display() {
        //this.theme.displayScene();
        this.gameboard.display();
        //this.animator.display();
    }

}


