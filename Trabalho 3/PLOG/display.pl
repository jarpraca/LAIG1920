/**
 * Writes column names
 */
draw_column_letters :- write('        a      b      c      d\n').

/**
 * Writes row number
 */
draw_row_number(N):-
	write('  '),
	print(N),
	write('  ').

/**
 * Draws board line separator
 */
draw_separator:- write('      ______ ______ ______ ______\n').

/**
 * Draws all pieces of a Row using Col to find each piece in Board
 */
drawColumn(_Board, _Row, 5).

drawColumn(Board, Row, Col) :-
	Col < 5,
	write('  '),
	column(ColLetter, Col),
	getPiece(Board, Row, ColLetter, Piece),
	getPieceString(Piece, String),
	write(String),
	write('  |'),
	NextCol is Col+1,
	drawColumn(Board, Row, NextCol).

/**
 * Draws all rows of Board and its internal separators
 */
drawRow( _Board, 5).

drawRow(Board, Row) :-
	Row < 5,
	write('     |      |      |      |      |\n'),
	draw_row_number(Row),
	write('|'),
	drawColumn(Board, Row, 1),
	write('\n     |______|______|______|______|\n'),
	NextRow is Row+1,
	drawRow(Board, NextRow).

/**
 * Draws Player name
 */
draw_name(Player):-
	playerName(Player, PlayerName),
	print(PlayerName),
	write('\n').

/**
 * Draws pieces of the list received
 */
draw_pieces([]) :-
	write('\n\n').

draw_pieces([H|T]):-
	getPieceString(H, X),	
	print(X),
	write(' '),
    draw_pieces(T).

/**
 * Draws Player name and its remaining pieces
 */
draw_player(Board, Player):-
	getPiecesPlayer(Board, Player, Pieces),
	draw_name(Player),
	write('Pieces : '),
	draw_pieces(Pieces).

/**
 * Draws Board (all rows, column and respective pieces)
 */
drawBoard(Board) :-
	nl,
	draw_column_letters,
	draw_separator,
	drawRow(Board, 1),
	nl.

/**
 * Draws Board and Player information
 */
display_game(Board, Player) :-
	drawBoard(Board),
	draw_player(Board, Player).

/**
 * Draws Player as winner of the game
 */
displayWinner(Player) :-
	write('  ============================='),nl,
	write('||                             ||'),nl,
	displayWinnerName(Player),
	write('||                             ||'),nl,
	write('  ============================='),nl.

/**
 * Draws Winner name 
 */
displayWinnerName(p) :-
	playerNameCaps(p, PlayerName),
	format("||         ~w WON!         ||", [PlayerName]),nl.

displayWinnerName(c1) :-
	playerNameCaps(c1, PlayerName),
	format("||       ~w WON!       ||", [PlayerName]),nl.

displayWinnerName(c2) :-
	playerNameCaps(c2, PlayerName),
	format("||       ~w WON!       ||", [PlayerName]),nl.

displayWinnerName(Player) :-
	playerNameCaps(Player, PlayerName),
	format("||        ~w WON!        ||", [PlayerName]),nl.

