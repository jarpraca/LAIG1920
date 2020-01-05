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
        this.currentPlayer = null;

        this.theme = new MySceneGraph(filename, scene);
        this.gameboard = null;
        this.prolog = new MyPrologInterface();

        this.state = 'start';

    }

    orchestrate() {
        switch (this.state) {
            case 'start': {

                break;
            }
            case 'start': {

                break;
            }
        }
    }

    startGame(player1, player2, levelPlayer1, levelPlayer2) {
        this.player1 = player1;
        this.player2 = player2;
        this.levelPlayer1 = levelPlayer1;
        this.levelPlayer2 = levelPlayer2;
        this.currentPlayer = this.player1;
        this.gameboard = new MyGameboard(this.scene, 'gameboard');
        this.gameboard.movePiece('WS1', '1a');
        this.gameboard.movePiece('WC1', '1b');
        //this.gameboard.movePiece('WY1', '1c');
        this.gameboard.movePiece('WO1', '1d');
        // console.log(this.prolog.convertGameboardToProlog(this.currentPlayer, this.gameboard));

        //this.prolog.verifyMoveRequest(this.currentPlayer, this.gameboard, '2', 'd', 'BY1');
        this.prolog.chooseMoveRequest(this.currentPlayer, this.gameboard, 3);

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

    managePick(mode, results) {
        if (mode == false) {
            if (results != null && results.length > 0) {
                for (var i = 0; i < results.length; i++) {
                    var obj = results[i][0];
                    if (obj) {
                        var uniqueId = results[i][1];
                        this.onObjectSelected(obj, uniqueId);
                    }
                }
                results.splice(0, results.length);
            }
        }
    }

    onObjectSelected(obj, uniqueId) {
        // if (obj.id == "cylinder")
        //     this.graph.movePieceTo('piece', 2, 2);

        // if (obj.id == "sphere")
        //     this.graph.movePieceTo('piece_sphere', 2, 2);

        obj.material.setAmbient(0,1,0,1);

        console.log("Picked object: " + obj.id + ", with pick id " + uniqueId);
    }

    display() {
        this.theme.displayScene();
        if(this.gameboard != null)
        this.gameboard.display();
        //this.animator.display();
    }

}