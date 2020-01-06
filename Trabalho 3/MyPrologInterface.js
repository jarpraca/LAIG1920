/**
 * MyPrologInterface
 * @constructor
*/
class MyPrologInterface {
    constructor() {
        this.setReplyNull();
    }

    getReply() {
        return this.reply;
    }

    setReplyNull() {
        this.reply = null;
    }

    convertGameboardToProlog(currentPlayer, gameboard) {
        let piecesBoard = gameboard.getAllBoardPieceTypes();
        let piecesPlayer1 = gameboard.getAllPlayerPieceTypes(1);
        let piecesPlayer2 = gameboard.getAllPlayerPieceTypes(2);

        let piecesBoardString = this.arrayToPrologList(piecesBoard);
        let piecesPlayer1String = this.arrayToPrologList(piecesPlayer1);
        let piecesPlayer2String = this.arrayToPrologList(piecesPlayer2);

        return 'board(' + currentPlayer + ',' + piecesBoardString + ',' + piecesPlayer1String + ',' + piecesPlayer2String + ')';
    }

    arrayToPrologList(array) {
        let list = '[';
        for(let key in array) {
            list += array[key];
            list += ',';
        }
        list = list.substring(0, list.length - 1);
        list += ']';

        return list;
    }

    sendRequest(requestString, onSuccess, onError, port) {
        let request = new XMLHttpRequest();
        var requestPort = port || 8081;

        request.onload = onSuccess || function (data) { console.log("Request successful. Reply: " + data.target.response); };
        request.onerror = onError || function () { console.log("Error waiting for response"); };

        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
        request.send();
    }

    parseStartPrologReply(data) {
        console.log('Reply ' + data.target.response);
    }

    startPrologGameError() {
        console.log('Error Prolog');
    }

    handleReply(data) {
        console.log(data);
        return data.target.response;
    }

    request(requestString) {
        this.sendRequest(requestString, this.handleReply);
    }

    gameOverRequest(currentPlayer, gameboard) {
        let board = this.convertGameboardToProlog(currentPlayer, gameboard);
        this.sendRequest('game_over(' + board + ')', this.gameOverReply);
    }

    gameOverReply = (data) => {
        console.log('Reply: ' + data.target.response);
        this.reply = data.target.response;
    }

    verifyMoveRequest(currentPlayer, gameboard, row, col, piece) {
        let board = this.convertGameboardToProlog(currentPlayer, gameboard);
        let piecetype = piece.substring(0, 2).toLowerCase();
        this.sendRequest('verifyMove(' + board + ',' + row + ',' + col + ',' + piecetype + ')', this.verifyMoveReply);
    }

    verifyMoveReply = (data) => {
        console.log('Reply: ' + data.target.response);
        switch(data.target.response){
            case 'true':{
                this.reply = true;
                break;
            }
            case 'false':{
                this.reply = false;
                break;
            }
        }
    }

    chooseMoveRequest(currentPlayer, gameboard, level) {
        let board = this.convertGameboardToProlog(currentPlayer, gameboard);
        this.sendRequest('chooseMove(' + board + ',' + level + ')', this.chooseMoveReply);
    }

    chooseMoveReply = (data) => {
        console.log('Reply: ' + data.target.response);
        this.reply = {
            piece: data.target.response.substring(5, 7).toUpperCase(),
            row: data.target.response.substring(1, 2),
            col: data.target.response.substring(3, 4)
        }
    }

    quitRequest() {
        this.sendRequest('quit', this.quitReply);
    }

    quitReply(data) {
        console.log('Reply: ' + data.target.response);
        this.reply = (data.target.response == 'goodbye');
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