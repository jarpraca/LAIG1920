/**
 * Checks if Player has a certain Piece
 */
hasPiece(Board, Player, Piece) :-
    getPiecesPlayer(Board, Player, Pieces),
    delete_duplicates(Pieces, UniquePieces),
    member(Piece, UniquePieces).
/**
 * Asks the user for a piece
 * Reads the piece
 * Checks if the piece is available
 * Returns the piece
 */
parsePiece(Board, Piece) :-
    getCurrentPlayer(Board, Player),
    playerName(Player, PlayerName),
    format("~n~w, what piece do you want to place? (use lower case) ", [PlayerName]),
	read(PieceSelected),
	(hasPiece(Board, Player, PieceSelected) -> 
        (format("~nThe piece ~w has been selected.~n", [PieceSelected]), Piece = PieceSelected);
        (format("~nThe piece ~w is not available.~n", [PieceSelected]), parsePiece(Board, Piece))
	).

/**
 * Asks the user for a row
 * Reads the row
 * Checks if the row is correct
 * Returns the row
 */
parseRow(Board, Row) :-
    getCurrentPlayer(Board, Player),
    playerName(Player, PlayerName),
    format("~n~w, in what row do you want to place it? ",  [PlayerName]),
	read(RowSelected),
    ((integer(RowSelected), RowSelected >= 1, RowSelected =< 4) ->
        Row = RowSelected;
        (write('\nRow must be 1, 2, 3 or 4!\n'), parseRow(Board, Row))
    ).

/**
 * Asks the user for a column
 * Reads the column
 * Checks if the column is correct
 * Returns the column
 */
parseColumn(Board, Col) :-
    getCurrentPlayer(Board, Player),
	playerName(Player, PlayerName),
    format("~n~w, in what column do you want to place it? ",  [PlayerName]),
	read(ColSelected),
    (column(ColSelected, _ColNumber) ->
        Col = ColSelected;
        (write('\nColumn must be a, b, c or d!\n'), parseColumn(Board, Col))
    ).

/**
 * Checks if there is a piece with the same shape but opposite color as Piece in a certain Row
 */
verifyRow(Board, Row, Piece) :-
	oppositePiece(Piece, Opposite),
    \+getPiece(Board, Row, a, Opposite),
    \+getPiece(Board, Row, b, Opposite),
    \+getPiece(Board, Row, c, Opposite),
    \+getPiece(Board, Row, d, Opposite).

/**
 * Checks if there is a piece with the same shape but opposite color as Piece in a certain Column
 */
verifyColumn(Board, Col, Piece) :-
	oppositePiece(Piece, Opposite),
    \+getPiece(Board, 1, Col, Opposite),
    \+getPiece(Board, 2, Col, Opposite),
    \+getPiece(Board, 3, Col, Opposite),
    \+getPiece(Board, 4, Col, Opposite).

/**
 * Checks if there is a piece with the same shape but opposite color as Piece in Quad 1
 */
verifyQuad(Board, 1, Piece) :-
	oppositePiece(Piece, Opposite),
    \+getPiece(Board, 1, a, Opposite),
    \+getPiece(Board, 1, b, Opposite),
    \+getPiece(Board, 2, a, Opposite),
    \+getPiece(Board, 2, b, Opposite).

/**
 * Checks if there is a piece with the same shape but opposite color as Piece in Quad 2
 */
verifyQuad(Board, 2, Piece) :-
	oppositePiece(Piece, Opposite),
    \+getPiece(Board, 1, c, Opposite),
    \+getPiece(Board, 1, d, Opposite),
    \+getPiece(Board, 2, c, Opposite),
    \+getPiece(Board, 2, d, Opposite).

/**
 * Checks if there is a piece with the same shape but opposite color as Piece in Quad 3
 */
verifyQuad(Board, 3, Piece) :-
	oppositePiece(Piece, Opposite),
    \+getPiece(Board, 3, a, Opposite),
    \+getPiece(Board, 3, b, Opposite),
    \+getPiece(Board, 4, a, Opposite),
    \+getPiece(Board, 4, b, Opposite).

/**
 * Checks if there is a piece with the same shape but opposite color as Piece in Quad 4
 */
verifyQuad(Board, 4, Piece) :-
	oppositePiece(Piece, Opposite),
    \+getPiece(Board, 3, c, Opposite),
    \+getPiece(Board, 3, d, Opposite),
    \+getPiece(Board, 4, c, Opposite),
    \+getPiece(Board, 4, d, Opposite).

/**
 * Checks if a cell (defined by Row and Col) of a Board is empty
 */
verifyEmptyCell(board(_CurrentPlayer, PiecesBoard, _PiecesPlayer1, _PiecesPlayer2), Row, Col) :-
    member(cell(Row, Col, e), PiecesBoard).

/**
 * Verifies if a move is valid, meaning the cell is empty and there isn't an opposite piece in the same row, column or quadrant
 * Prints error if any of the previous constrains fails
 */
verifyMoveError(Board, Row, Col, Piece) :- 
    (verifyEmptyCell(Board, Row, Col) ->
        true;
        (write('\nThis cell already has a piece!\n'), fail)
    ),
    (verifyRow(Board, Row, Piece) ->
        true;
        (write('\nYou cannot place a piece in the same row as another piece of the same shape but different color!\n'), fail)
    ),
    (verifyColumn(Board, Col, Piece) ->
        true;
        (write('\nYou cannot place a piece in the same column as another piece of the same shape but different color!\n'), fail)
    ),
    ((getQuad(Row, Col, Quad), verifyQuad(Board, Quad, Piece)) ->
        true;
        (write('\nYou cannot place a piece in the same quadrant as another piece of the same shape but different color!\n'), fail)
    ).

/**
 * Verifies if a move is valid, meaning the cell is empty and there isn't an opposite piece in the same row, column or quadrant
 */
verifyMove(Board, Row, Col, Piece) :- 
    verifyEmptyCell(Board, Row, Col),
    verifyRow(Board, Row, Piece),
    verifyColumn(Board, Col, Piece),
    getQuad(Row, Col, Quad),
    verifyQuad(Board, Quad, Piece).

/**
 * Removes the element X from the list L
 * Returns the resulting list as L1
 */
delete_one(X,L,L1):-
    append(La,[X|Lb],L),
    append(La,Lb,L1). 

/**
 * Removes the duplicate elements from the list X
 * Returns the resulting list as Y
 */
delete_duplicates(X, Y) :-
    sort(X, Y).

/**
 * Gets the shapes of the pieces of a certain Row
 * Return a list with the shapes as List
 */
rowToList(Board, Row, List) :-
    getPiece(Board, Row, a, X1),
    getPiece(Board, Row, b, X2),
    getPiece(Board, Row, c, X3),
    getPiece(Board, Row, d, X4),
    getShape(X1, Y1),
    getShape(X2, Y2),
    getShape(X3, Y3),
    getShape(X4, Y4),
    List = [Y1, Y2, Y3, Y4].

/**
 * Gets the shapes of the pieces of a certain Column
 * Return a list with the shapes as List
 */
columnToList(Board, Col, List) :-
    getPiece(Board, 1, Col, X1),
    getPiece(Board, 2, Col, X2),
    getPiece(Board, 3, Col, X3),
    getPiece(Board, 4, Col, X4),
    getShape(X1, Y1),
    getShape(X2, Y2),
    getShape(X3, Y3),
    getShape(X4, Y4),
    List = [Y1, Y2, Y3, Y4].

/**
 * Gets the shapes of the pieces of Quad 1
 * Return a list with the shapes as List
 */
quadToList(Board, 1, List) :-
    getPiece(Board, 1, a, X1),
    getPiece(Board, 1, b, X2),
    getPiece(Board, 2, a, X3),
    getPiece(Board, 2, b, X4),
    getShape(X1, Y1),
    getShape(X2, Y2),
    getShape(X3, Y3),
    getShape(X4, Y4),
    List = [Y1, Y2, Y3, Y4].

/**
 * Gets the shapes of the pieces of Quad 2
 * Return a list with the shapes as List
 */
quadToList(Board, 2, List) :-
    getPiece(Board, 1, c, X1),
    getPiece(Board, 1, d, X2),
    getPiece(Board, 2, c, X3),
    getPiece(Board, 2, d, X4),
    getShape(X1, Y1),
    getShape(X2, Y2),
    getShape(X3, Y3),
    getShape(X4, Y4),
    List = [Y1, Y2, Y3, Y4].

/**
 * Gets the shapes of the pieces of Quad 3
 * Return a list with the shapes as List
 */
quadToList(Board, 3, List) :-
    getPiece(Board, 3, a, X1),
    getPiece(Board, 3, b, X2),
    getPiece(Board, 4, a, X3),
    getPiece(Board, 4, b, X4),
    getShape(X1, Y1),
    getShape(X2, Y2),
    getShape(X3, Y3),
    getShape(X4, Y4),
    List = [Y1, Y2, Y3, Y4].

/**
 * Gets the shapes of the pieces of Quad 4
 * Return a list with the shapes as List
 */
quadToList(Board, 4, List) :-
    getPiece(Board, 3, c, X1),
    getPiece(Board, 3, d, X2),
    getPiece(Board, 4, c, X3),
    getPiece(Board, 4, d, X4),
    getShape(X1, Y1),
    getShape(X2, Y2),
    getShape(X3, Y3),
    getShape(X4, Y4),
    List = [Y1, Y2, Y3, Y4].

/**
 * Checks if a list doesn't have duplicate elements and has length 4
 */
checkListUnique([H|[]], 1) :-
    \+H == e.

checkListUnique([H|T], N) :-
    \+H == e,
    \+member(H, T),
    X is N-1,
    checkListUnique(T, X).

/**
 * Checks if a Player won in a Row, meaning if there are all the shapes
 */
checkRowWin(Board, Row) :- 
    rowToList(Board, Row, Pieces),
    checkListUnique(Pieces, 4).

/**
 * Checks if a Player won in a Column, meaning if there are all the shapes
 */
checkColumnWin(Board, Col) :- 
    columnToList(Board, Col, Pieces),
    checkListUnique(Pieces, 4).

/**
 * Checks if a Player won in a Quad, meaning if there are all the shapes
 */
checkQuadWin(Board, Quad) :- 
    quadToList(Board, Quad, Pieces),
    checkListUnique(Pieces, 4).

/**
 * Checks if a Player won, meaning if there are all the shapes in the same Row, Col or Quad
 */
checkWin(Board) :- 
    checkRowWin(Board, 1);
    checkRowWin(Board, 2);
    checkRowWin(Board, 3);
    checkRowWin(Board, 4);
    checkColumnWin(Board, a);
    checkColumnWin(Board, b);
    checkColumnWin(Board, c);
    checkColumnWin(Board, d);
    checkQuadWin(Board, 1);
    checkQuadWin(Board, 2);
    checkQuadWin(Board, 3);
    checkQuadWin(Board, 4).

/**
 * Checks if the opponent doesn't have the piece or can't play the move that avoids its defeat
 */
opponent_loses([Row, Col, Piece], Board, Player) :-
    oppositePiece(Piece, Opposite),
    getOpponentPlayer(Player, Opponent), 
    (
        \+hasPiece(Board, Opponent, Opposite);
        \+verifyMove(Board, Row, Col, Opposite)
    ).

/**
 * Checks if the opponent has the piece and is able to play the move that makes him win
 */
opponent_can_win([Row, Col, Piece], Board, Player) :-
    oppositePiece(Piece, Opposite),
    getOpponentPlayer(Player, Opponent), 
    hasPiece(Board, Opponent, Opposite),
    verifyMove(Board, Row, Col, Opposite).

/**
 * Gets the Player's Level of difficulty
 */
currentPlayerLevel(Player, LevelPlayer1, LevelPlayer2, CurrentLevel) :-
    playerNumber(Player, PlayerNumber),
    (PlayerNumber =:= 1 ->
        CurrentLevel is LevelPlayer1;
        CurrentLevel is LevelPlayer2
    ).