/**
 * Draws game menu
 */
displayMenu :-
    write(' ________________________________________________________________'),nl,
    write('|                                                                |'),nl,
    write('|                                                                |'),nl,
    write('|              o-o  o   o   O  o   o o-O-o o-O-o o  o            |'),nl,
    write('|             o   o |   |  / \\ |\\  |   |     |   | /             |'),nl,
    write('|             |   | |   | o---o| \\ |   |     |   OO              |'),nl,
    write('|             o   O |   | |   ||  \\|   |     |   | \\             |'),nl,
    write('|              o-O\\  o-o  o   oo   o   o   o-O-o o  o            |'),nl,
    write('|                                                                |'),nl,
    write('|                                                                |'),nl,
    write('|                  _____ ______________________                  |'),nl,
    write('|                 |     |                      |                 |'),nl,
    write('|                 |  1  |   Player vs Player   |                 |'),nl,
    write('|                 |_____|______________________|                 |'),nl,
    write('|                 |     |                      |                 |'),nl,
    write('|                 |  2  |  Player vs Computer  |                 |'),nl,
    write('|                 |_____|______________________|                 |'),nl,
    write('|                 |     |                      |                 |'),nl,
    write('|                 |  3  | Computer vs Computer |                 |'),nl,
    write('|                 |_____|______________________|                 |'),nl,
    write('|                 |     |                      |                 |'),nl,
    write('|                 |  0  |         Exit         |                 |'),nl,
    write('|                 |_____|______________________|                 |'),nl,
    write('|                                                                |'),nl,
    write('|                                                                |'),nl,
    write('|                                                                |'),nl,
    write('|                                                                |'),nl,
    write('|             Developed by: Joao Praca, Lucas Ribeiro            |'),nl,
    write('|________________________________________________________________|'),nl.

/**
 * Draws computer levels
 */
displayLevels :-
    write('   _____ ______________________ '),nl,
    write('  |     |                      |'),nl,
    write('  |  1  |         Easy         |'),nl,
    write('  |_____|______________________|'),nl,
    write('  |     |                      |'),nl,
    write('  |  2  |        Medium        |'),nl,
    write('  |_____|______________________|'),nl,
    write('  |     |                      |'),nl,
    write('  |  3  |         Hard         |'),nl,
    write('  |_____|______________________|'),nl.

/**
 * Parses menu option chosen and behaves accordingly:
 * 0 - Exit
 * 1 - Player vs Player
 * 2 - Choose level of Computer
 *     Computer vs Player
 * 3 - Choose level of Computer 1
 *     Choose level of Computer 2
 *     Computer vs Computer
 */
parseOption(0) :-
    fail.

parseOption(1) :-
	startGame(p1, 0, 0).

parseOption(2) :-
    choose_level(c, Level),
	startGame(p, 0, Level).

parseOption(3) :-
    choose_level(c1, LevelC1),
    choose_level(c2, LevelC2),
	startGame(c1, LevelC1, LevelC2).

/**
 * Parses replay option chosen and behaves accordingly
 */
parseReplay(y) :-
	menu.

parseReplay(n).

parseReplay(_) :-
    replay.

/**
 * Asks user if he wants to play again
 */
replay :-
    write('\nDo you want to play again? (y/n) '),
	read(Replay),
	parseReplay(Replay).

/**
 * Displays levels
 * Asks user what level he wants for the respective computer player
 */
choose_level(Player, Level) :-
    displayLevels,
    playerName(Player, PlayerName),
    format("~nChoose a level for ~w: ", [PlayerName]),
    read(Level),
    (level(Level) ->
        true;
        (write("\nLevel must be 1, 2 or 3!\n"), choose_level(Player, Level))
    ).

/**
 * Displays menu
 * Asks user which game option he wants to play (P vs P, P vs C, C vs C, exit)
 */
menu :-
	displayMenu,
	write('\nPlease choose an option: '),
	read(Option),
	(parseOption(Option) ->
        replay;
        true
    ).
