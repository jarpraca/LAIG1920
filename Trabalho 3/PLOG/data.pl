/**
 * Cell of a Board
 */
cell(_Row, _Col, _Piece).

/**
 * Initial empty Board
 */
initialPiecesBoard([cell(1,a,e), cell(1,b,e), cell(1,c,e), cell(1,d,e),
                    cell(2,a,e), cell(2,b,e), cell(2,c,e), cell(2,d,e),
                    cell(3,a,e), cell(3,b,e), cell(3,c,e), cell(3,d,e),
                    cell(4,a,e), cell(4,b,e), cell(4,c,e), cell(4,d,e)]).

/**
 * Initial list of pieces for Player 1
 */
initialPiecesPlayer1([wo,wo,wy,wy,ws,ws,wc,wc]).

/**
 * Initial list of pieces for Player 2
 */
initialPiecesPlayer2([bo,bo,by,by,bs,bs,bc,bc]).

/**
 * Board
 */
board(_CurrentPlayer, _PiecesBoard, _PiecesPlayer1, _PiecesPlayer2).

/**
 * Gets the player that is currently playing
 */
getCurrentPlayer(board(CurrentPlayer, _PiecesBoard, _PiecesPlayer1, _PiecesPlayer2), CurrentPlayer).

/**
 * Gets the current list of pieces of Player 1
 */
getPiecesPlayer(board(_CurrentPlayer, _PiecesBoard, PiecesPlayer1, _PiecesPlayer2), FirstPlayer, PiecesPlayer1) :-
    playerNumber(FirstPlayer, 1).

/**
 * Gets the current list of pieces of Player 2
 */
getPiecesPlayer(board(_CurrentPlayer, _PiecesBoard, _PiecesPlayer1, PiecesPlayer2), SecondPlayer, PiecesPlayer2) :-
    playerNumber(SecondPlayer, 2).

/**
 * Gets the current pieces of board
 */
getPiecesBoard(board(_CurrentPlayer, PiecesBoard, _PiecesPlayer1, _PiecesPlayer2), PiecesBoard).

/**
 * Inserts a Piece in the Board
 * Removes a Piece from the List of Pieces of Player 1
 * Returns the new board
 */
setPiece(board(FirstPlayer, PiecesBoard, PiecesPlayer1, PiecesPlayer2), Row, Col, Piece, board(FirstPlayer, NewPiecesBoard, NewPiecesPlayer1, PiecesPlayer2)) :-
    playerNumber(FirstPlayer, 1),
    updateBoardPieces(PiecesBoard, Row, Col, Piece, NewPiecesBoard),
    updatePlayerPieces(PiecesPlayer1, 1, Piece, NewPiecesPlayer1).

/**
 * Inserts a Piece in the Board
 * Removes a Piece from the List of Pieces of Player 2
 * Returns the new board
 */
setPiece(board(SecondPlayer, PiecesBoard, PiecesPlayer1, PiecesPlayer2), Row, Col, Piece, board(SecondPlayer, NewPiecesBoard, PiecesPlayer1, NewPiecesPlayer2)) :-
    playerNumber(SecondPlayer, 2),
    updateBoardPieces(PiecesBoard, Row, Col, Piece, NewPiecesBoard),
    updatePlayerPieces(PiecesPlayer2, 2, Piece, NewPiecesPlayer2).

/**
 * Inserts a Piece in the board pieces
 * Removes the empty cell in the same position
 * Returns the new board pieces
 */
updateBoardPieces(PiecesBoard, Row, Col, Piece, NewPiecesBoard) :-
    delete_one(cell(Row, Col, e), PiecesBoard, NB),
    append(NB, [cell(Row, Col, Piece)], NewPiecesBoard).

/**
 * Removes a Piece from the List of Pieces of Player 1
 * Returns the new list
 */
updatePlayerPieces(PiecesPlayer1, 1, Piece, NewPiecesPlayer1) :-
    delete_one(Piece, PiecesPlayer1, NewPiecesPlayer1).

/**
 * Removes a Piece from the List of Pieces of Player 2
 * Returns the new list
 */
updatePlayerPieces(PiecesPlayer2, 2, Piece, NewPiecesPlayer2) :-
    delete_one(Piece, PiecesPlayer2, NewPiecesPlayer2).

/**
 * Gets a piece from the Board in a certain Row and Col
 * Return the Piece
 */
getPiece(Board, Row, Col, Piece) :-
    getPiecesBoard(Board, PiecesBoard),
    member(cell(Row, Col, Piece), PiecesBoard).

/**
 * Associates a piece with its respective string to display
 */
getPieceString(e, '  ').
getPieceString(by, 'BY').
getPieceString(bo, 'BO').
getPieceString(bc, 'BC').
getPieceString(bs, 'BS').
getPieceString(wy, 'WY').
getPieceString(wo, 'WO').
getPieceString(wc, 'WC').
getPieceString(ws, 'WS').

/**
 * Associates a piece with its respective shape
 */
getShape(e, e).
getShape(by, y).
getShape(bo, o).
getShape(bc, c).
getShape(bs, s).
getShape(wy, y).
getShape(wo, o).
getShape(wc, c).
getShape(ws, s).

/**
 * Associates a row and column with its respective quadrant
 */
getQuad(1,a,1).
getQuad(1,b,1).
getQuad(2,a,1).
getQuad(2,b,1).

getQuad(1,c,2).
getQuad(1,d,2).
getQuad(2,c,2).
getQuad(2,d,2).

getQuad(3,a,3).
getQuad(3,b,3).
getQuad(4,a,3).
getQuad(4,b,3).

getQuad(3,c,4).
getQuad(3,d,4).
getQuad(4,c,4).
getQuad(4,d,4).

/**
 * Associates two pieces with the same shape
 */
oppositePiece(by, wy).
oppositePiece(bo, wo).
oppositePiece(bc, wc).
oppositePiece(bs, ws).
oppositePiece(wy, by).
oppositePiece(wo, bo).
oppositePiece(wc, bc).
oppositePiece(ws, bs).

/**
 * Associates a piece with its respective owner
 */
piecePlayer(FirstPlayer, wo) :-
    playerNumber(FirstPlayer, 1).
piecePlayer(FirstPlayer, wy) :-
    playerNumber(FirstPlayer, 1).
piecePlayer(FirstPlayer, ws) :-
    playerNumber(FirstPlayer, 1).
piecePlayer(FirstPlayer, wc) :-
    playerNumber(FirstPlayer, 1).
piecePlayer(SecondPlayer, bo) :-
    playerNumber(SecondPlayer, 2).
piecePlayer(SecondPlayer, by) :-
    playerNumber(SecondPlayer, 2).
piecePlayer(SecondPlayer, bs) :-
    playerNumber(SecondPlayer, 2).
piecePlayer(SecondPlayer, bc) :-
    playerNumber(SecondPlayer, 2).

/**
 * Associates two opponents that play against each other
 */
getOpponentPlayer(p1, p2).
getOpponentPlayer(p2, p1).
getOpponentPlayer(p, c).
getOpponentPlayer(c, p).
getOpponentPlayer(c1, c2).
getOpponentPlayer(c2, c1).

/**
 * Associates a player with its respective number
 */
playerNumber(p1, 1).
playerNumber(p, 1).
playerNumber(c1, 1).
playerNumber(p2, 2).
playerNumber(c, 2).
playerNumber(c2, 2).

/**
 * Associates a player with its respective string to display
 */
playerName(p1, 'Player 1').
playerName(p, 'Player').
playerName(c1, 'Computer 1').
playerName(p2, 'Player 2').
playerName(c, 'Computer').
playerName(c2, 'Computer 2').

/**
 * Associates a player with its respective string to display in upper case
 */
playerNameCaps(p1, 'PLAYER 1').
playerNameCaps(p, 'PLAYER').
playerNameCaps(c1, 'COMPUTER 1').
playerNameCaps(p2, 'PLAYER 2').
playerNameCaps(c, 'COMPUTER').
playerNameCaps(c2, 'COMPUTER 2').

/**
 * Associates a player with its respective type (player or computer)
 */
playerType(p1, p).
playerType(p, p).
playerType(p2, p).
playerType(c1, c).
playerType(c, c).
playerType(c2, c).

/**
 * Associates a column letter with a respective number
 */
column(a,1).
column(b,2).
column(c,3).
column(d,4).

/**
 * Existing levels
 */
level(1).
level(2).
level(3).