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
        scene.gameOrchestrator = this;

        this.player1 = null;
        this.player2 = null;
        this.levelPlayer1 = null;
        this.levelPlayer2 = null;

        this.theme = new MySceneGraph(filename, scene);
        this.gameboard = new MyGameboard(this.scene, 'gameboard');
        this.prolog = new MyPrologInterface();

        this.state = 'start';

        console.log(this.prolog.request('switch(board(p1,[],[],[]))'));
    }

    orchestrate() {
        switch(this.state){
            case 'start':{

                break;
            }
            case 'start':{

                break;
            }
        }
    }

    startGame(player1, player2, levelPlayer1, levelPlayer2) {
        this.player1 = player1;
        this.player2 = player2;
        this.levelPlayer1 = levelPlayer1;
        this.levelPlayer2 = levelPlayer2;

        // this.state = ;
    }

    endGame() {
        this.player1 = null;
        this.player2 = null;
        this.levelPlayer1 = null;
        this.levelPlayer2 = null;

        // this.state = ;
    }

    update(t) {
        // this.animator.update(t);
    }

    display() {
        this.theme.displayScene();
        this.gameboard.display();
        //this.animator.display();
    }

}