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
        this.currentMove = null;
        this.animation = null;

        this.theme = new MySceneGraph(filename, scene);
        this.gameboard = null;
        this.gameSequence = new MyGameSequence(this.scene);
        this.prolog = new MyPrologInterface();
        // this.animator = new MyAnimator(this.scene);

        this.state = 'menu';
    }

    orchestrate() {
        switch (this.state) {
            case 'menu': {

                break;
            }
            case 'start': {
                this.gameboard = new MyGameboard(this.scene, 'gameboard');
                this.currentMove = null;
                this.resetCurrentMove();

                this.animation = new MyCameraAnimate(this.scene, this.scene.cameras[0], this.scene.cameras[1], 1);
                this.state = 'animation';
                this.nextState = this.player1;
                break;
            }
            case 'p1': {
                this.scene.setCameraPlayer(1);
                this.state = 'selectPiece';
                break;
            }
            case 'p2': {
                this.scene.setCameraPlayer(2);
                this.state = 'selectPiece';
                break;
            }
            case 'p': {
                this.scene.setCameraPlayer(1);
                this.state = 'selectPiece';
                break;
            }
            case 'c': {
                this.scene.setCameraPlayer(2);
                this.state = 'chooseMove';
                break;
            }
            case 'c1': {
                this.scene.setCameraPlayer(1);
                this.state = 'chooseMove';
                break;
            }
            case 'c2': {
                this.scene.setCameraPlayer(2);
                this.state = 'chooseMove';
                break;
            }
            case 'switchPlayer': {
                if (this.currentPlayer == this.player1) {
                    this.currentPlayer = this.player2;
                    this.animation = new MyCameraAnimate(this.scene, this.scene.cameras[1], this.scene.cameras[2], 1);
                }
                else if (this.currentPlayer == this.player2) {
                    this.currentPlayer = this.player1;
                    this.animation = new MyCameraAnimate(this.scene, this.scene.cameras[2], this.scene.cameras[1], 1);
                }

                this.state = 'animation';
                this.nextState = this.currentPlayer;
                break;
            }
            case 'animation': {
                if (this.animation.finished) {
                    this.animation = null;
                    this.state = this.nextState;
                }
                break;
            }
            case 'selectPiece': {

                break;
            }
            case 'selectTile': {

                break;
            }
            case 'checkMove': {
                this.prolog.verifyMoveRequest(this.currentPlayer, this.gameboard, this.currentMove.row, this.currentMove.col, this.currentMove.piece);
                this.state = 'checkMoveReply';
                break;
            }
            case 'checkMoveReply': {
                if (this.prolog.getReply() != null) {
                    if (this.prolog.getReply()) {
                        this.state = 'movePiece1';
                    }
                    else {
                        alert('This move is not valid! Choose again!');
                        this.resetCurrentMove();
                        this.state = 'selectPiece';
                    }
                    this.prolog.setReplyNull();
                }
                break;
            }
            case 'chooseMove': {
                let currentLevel;
                switch (this.currentPlayer) {
                    case 'c': {
                        currentLevel = this.levelPlayer2;
                        break;
                    }
                    case 'c1': {
                        currentLevel = this.levelPlayer1;
                        break;
                    }
                    case 'c2': {
                        currentLevel = this.levelPlayer2;
                        break;
                    }
                }
                this.prolog.chooseMoveRequest(this.currentPlayer, this.gameboard, currentLevel);
                this.state = 'chooseMoveReply';
                break;
            }
            case 'chooseMoveReply': {
                if (this.prolog.getReply() != null) {
                    this.currentMove = this.prolog.getReply();
                    this.prolog.setReplyNull();
                    this.state = 'movePiece1';
                }
                break;
            }
            case 'movePiece1': {
                if (this.currentMove.piece.length == 2) {
                    if (this.gameboard.playerHasPiece1(this.currentMove.piece))
                        this.currentMove.piece = this.currentMove.piece + '1';
                    else
                        this.currentMove.piece = this.currentMove.piece + '2';
                }
                else if (this.currentMove.piece.length == 3)
                    this.currentMove.piece = this.currentMove.piece;

                this.addToGameSequence();
                // this.gameboard.movePiece(this.currentMove.piece, this.currentMove.row + this.currentMove.col);
                let pieceID = this.currentMove.piece;
                let finalTileID = this.currentMove.row + this.currentMove.col;
                let initialTile = this.gameboard.getTileWithPieceByID(pieceID);
                let finalTile = this.gameboard.getTileByID(finalTileID);
                let piece = this.gameboard.getPieceOnTileByID(initialTile.id);
                this.gameboard.removePieceFromTileByID(initialTile.id);
                this.gameboard.getTileByID(initialTile.id).disableSelected();
                piece.disableSelectable();
                piece.disableSelected();

                this.middle = [(initialTile.x + finalTile.x)/2, 10, (initialTile.z + finalTile.z)/2];

                this.animation = new MyPieceAnimation(this.scene, piece, [initialTile.x, initialTile.y, initialTile.z], this.middle, 0.5);

                this.currentMove.piece = piece;
               
                this.nextState = 'movePiece2';
                this.state = 'animation';
                break;
            }
            case 'movePiece2': {
                let finalTileID = this.currentMove.row + this.currentMove.col;
                let finalTile = this.gameboard.getTileByID(finalTileID);
                let piece = this.currentMove.piece;

                this.animation = new MyPieceAnimation(this.scene, piece, this.middle, [finalTile.x, finalTile.y, finalTile.z], 0.5);

                this.nextState = 'endMovePiece';
                this.state = 'animation';
                break;
            }
            case 'endMovePiece': {
                let finalTileID = this.currentMove.row + this.currentMove.col;
                this.gameboard.addPieceToTileByID(this.currentMove.piece, finalTileID);

                this.currentMove.piece = this.currentMove.piece.id;
                this.resetCurrentMove();
                this.state = 'checkGameOver';
                break;
            }
            case 'checkGameOver': {
                this.prolog.gameOverRequest(this.currentPlayer, this.gameboard);
                this.state = 'checkGameOverReply';
                break;
            }
            case 'checkGameOverReply': {
                if (this.prolog.getReply() != null) {
                    if (this.prolog.getReply() == '0')
                        this.state = 'switchPlayer';
                    else
                        this.state = 'gameOver';

                    this.prolog.setReplyNull();
                }
                break;
            }
            case 'gameOver': {
                alert('Player ' + this.currentPlayer.toUpperCase() + ' won!');
                this.state = 'end';
                break;
            }
            case 'end': {
                this.gameboard = null;
                this.player1 = null;
                this.player2 = null;
                this.levelPlayer1 = null;
                this.levelPlayer2 = null;
                this.currentPlayer = null;
                if (this.scene.interface.startButton == null)
                    this.scene.interface.endGameButtons();

                this.animation = new MyCameraAnimate(this.scene, this.scene.camera, this.scene.cameras[0], 1);
                this.state = 'animation';
                this.nextState = 'menu';
                break;
            }
            case 'quit': {
                this.prolog.quitRequest();
                this.state = 'quitReply';
                break;
            }
            case 'quitReply': {
                if (this.prolog.getReply() != null) {
                    if (this.prolog.getReply()) {
                        alert("Game server has been closed! If you'd like to play again, please refresh the page!");
                    }
                    this.prolog.setReplyNull();
                    this.state = 'menu';
                }
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

        this.state = 'start';
    }

    endGame() {
        this.state = 'end';
    }

    quitGame() {
        this.state = 'quit';
    }

    undoMovePiece(piece, originTile, destinationTile) {
        this.gameboard.movePiece(piece, originTile);
        this.gameboard.getTileByID(destinationTile).enableSelectable();
        this.gameboard.getPieceByID(piece).enableSelectable();
    }

    undo() {
        let last = this.gameSequence.getLast();
        this.gameboard = last.initialGameboard;
        this.undoMovePiece(last.piece, last.originTile, last.destinationTile);
        this.gameSequence.undo();
        this.state = 'switchPlayer';
    }

    addToGameSequence() {
        let piece = this.currentMove.piece;
        let initialTile = this.gameboard.getTileWithPieceByID(piece).id;
        let destinationTile = this.currentMove.row + this.currentMove.col;

        this.gameSequence.addGameMove(new MyGameMove(this.scene, piece, initialTile, destinationTile, this.gameboard));
    }

    update(t) {
        if (this.animation != null)
            this.animation.update(t);
    }

    managePick(mode, results) {
        if (mode == false && (this.state == 'selectPiece' || this.state == 'selectTile')) {
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
        let currPlayer;
        if (this.currentPlayer == this.player1)
            currPlayer = 1;
        else if (this.currentPlayer == this.player2)
            currPlayer = 2;

        if (obj instanceof MyPiece) {
            if (this.state == 'selectPiece' && this.gameboard.belongsToPlayer(obj.id, currPlayer)) {
                obj.enableSelected();
                this.currentMove.piece = obj.id;
                this.state = 'selectTile';
            }
            else if (obj.selected && this.state == 'selectTile') {
                obj.disableSelected();
                this.currentMove.piece = null;
                this.state = 'selectPiece';
            }
        }
        else if (obj instanceof MyTile && this.state == 'selectTile') {
            obj.enableSelected();
            this.currentMove.row = obj.row;
            this.currentMove.col = obj.col;
            this.state = 'checkMove';
        }

        console.log("Picked object: " + obj.id + ", with pick id " + uniqueId);
    }

    resetCurrentMove() {
        if (this.currentMove != null) {
            this.gameboard.getPieceByID(this.currentMove.piece).disableSelected();
            this.gameboard.getTileByID(this.currentMove.row + this.currentMove.col).disableSelected();
        }
        this.currentMove = {
            piece: null,
            row: null,
            col: null
        };
    }

    display() {
        this.theme.displayScene();
        if (this.gameboard != null) {
            this.gameboard.display();
        }
        if(this.animation != null){
            this.animation.display();
        }
        //this.animator.display();
    }

}