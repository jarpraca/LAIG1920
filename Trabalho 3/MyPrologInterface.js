/**
 * MyPrologInterface
 * @constructor
 * @param scene - Reference to MyScene object
 * @param filename - name of XML scene
 * @param piece - piece moved
 * @param originTile - origin tile
 * @param destinationTile - destination tile
 * @param initialGameboard - gameboard before move
*/
class MyPrologInterface {
    constructor() {
    }

    convertGameboardToProlog(gameboard) {
        
    }

    sendRequest(requestString, onSuccess, onError, port) {
        let request = new XMLHttpRequest();
        var requestPort = port || 8081;

        // request.addEventListener("load", this.parseStartPrologReply);
        // request.addEventListener("error", this.startPrologGameError);
        //request.onload = onSuccess || this.parseStartPrologReply(data);
        request.onload = onSuccess || function (data) { console.log("Request successful. Reply: " + data.target.response); };
        request.onerror = onError || function () { console.log("Error waiting for response"); };

        //request.onerror = onError || this.startPrologGameError();

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
        console.log('data');
        console.log(data);
        return data.target.response;
    }

    request(requestString) {
        this.sendRequest(requestString, this.handleReply);
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