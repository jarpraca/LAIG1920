/**
 * Switches current player in Board between
 * p1 and p2
 * p and c
 * c1 and c2
 */
switchPlayer(board(CurrentPlayer, PiecesBoard, PiecesPlayer1, PiecesPlayer2), board(NextPlayer, PiecesBoard, PiecesPlayer1, PiecesPlayer2)) :-
	getOpponentPlayer(CurrentPlayer, NextPlayer).

/**
 * Inserts Piece in Row and Col of Board
 * Removes Piece from current player's pieces list
 * Returns resulting board as NewBoard
 */
move([Row, Col, Piece], Board, NewBoard) :-
    setPiece(Board, Row, Col, Piece, NewBoard).

/**
 * Moves piece for player type:
 * As the player is the user, Level is not used
 * Asks for Piece, Row and Column
 * Verifies if that Move is valid
 * If so, moves piece
 * Returns resulting board as NewBoard
 */
movePiece(p, Board, NewBoard, Level) :-
	parsePiece(Board, Piece),
	parseRow(Board, Row),
	parseColumn(Board, Col),
	(verifyMoveError(Board, Row, Col, Piece) ->
		(move([Row, Col, Piece], Board, NB), NewBoard = NB);
		movePiece(p, Board, NewBoard, Level)
	).

/**
 * Moves piece for computer type:
 * Choses best move according to computer Level
 * Moves piece
 * Returns resulting board as NewBoard
 * If Level is 1 or 2, sleeps for 1sec for readability purposes
 */
movePiece(c, Board, NewBoard, 2) :-
	write('Thinking...'),
	choose_move(Board, 2, Move),
	move(Move, Board, NewBoard),
	nl.

movePiece(c, Board, NewBoard, Level) :-
	write('Thinking...'),
	choose_move(Board, Level, Move),
	move(Move, Board, NewBoard),
	sleep(1),
	nl.

/**
 * Checks if the current player won the game
 * If so, returns current player as Winner
 */
game_over(Board, Winner) :- 
    checkWin(Board),
    getCurrentPlayer(Board, Player),
	Winner = Player.

/**
 * Game loop:
 * Displays Board
 * Moves piece for current player
 * Checks if current player won
 * If so, displays winner
 * Else, switches player and plays next round
 */
play_round(Board, LevelPlayer1, LevelPlayer2) :-
    getCurrentPlayer(Board, Player),
	playerType(Player, PlayerType),
	currentPlayerLevel(Player, LevelPlayer1, LevelPlayer2, CurrentLevel),
	display_game(Board, Player),
	movePiece(PlayerType, Board, NewBoard, CurrentLevel),
	(game_over(NewBoard, Winner) ->
		(drawBoard(NewBoard), displayWinner(Winner));
		(switchPlayer(NewBoard, NextBoard), play_round(NextBoard, LevelPlayer1, LevelPlayer2))
	).

/**
 * Starts the game:
 * Gets an empty board of pieces and the initial lists of pieces for each player
 * Plays first round starting with FirstPlayer
 */
startGame(FirstPlayer, LevelPlayer1, LevelPlayer2) :-
	initialPiecesBoard(InitialPiecesBoard),
    initialPiecesPlayer1(InitialPiecesPlayer1),
    initialPiecesPlayer2(InitialPiecesPlayer2),
	play_round(board(FirstPlayer, InitialPiecesBoard, InitialPiecesPlayer1, InitialPiecesPlayer2), LevelPlayer1, LevelPlayer2).
