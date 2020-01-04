/**
 * Gets a list of all valid moves the Player can play in this Board
 * Returns resulting list as ListOfMoves
 */
valid_moves(Board, Player, ListOfMoves) :-
    findall(Move, valid_move(Board, Player, Move), ListOfMoves).

/**
 * Gets one valid move the Player can play in this Board
 * Returns resulting move as Move
 */
valid_move(Board, Player, Move) :-
    getQuad(Row, Col, _Quad),
    piecePlayer(Player, Piece),
    hasPiece(Board, Player, Piece),
    verifyMove(Board, Row, Col, Piece),
    Move = [Row, Col, Piece].

/**
 * Checks which moves from a list give the opponent the opportunity to win:
 *      Checks if a move gives the current player the victory
 *      Checks if the opponent can play the opposite move (same row, same column and same piece shape)
 */
losing_moves(_Board, _Player, [], ListOfLosingMoves, ListOfLosingMoves).

losing_moves(Board, Player, [Move | ListOfMoves], Aux, ListOfLosingMoves) :-
    move(Move, Board, NewBoard),
    ((checkWin(NewBoard), opponent_can_win(Move, Board, Player)) ->
        (
            append([Move], Aux, NewAux),
            losing_moves(Board, Player, ListOfMoves, NewAux, ListOfLosingMoves)
        );
        losing_moves(Board, Player, ListOfMoves, Aux, ListOfLosingMoves)
    ).

/**
 * Checks which moves from a list give the current player the victory:
 *      Checks if a move gives the current player the victory 
 *      Checks if the opponent cant play the opposite move (same row, same column and same piece shape)
 */
winning_moves(_Board, _Player, [], ListOfWinningMoves, ListOfWinningMoves).

winning_moves(Board, Player, [Move | ListOfMoves], Aux, ListOfWinningMoves) :-
    move(Move, Board, NewBoard),
    ((checkWin(NewBoard), opponent_loses(Move, Board, Player)) ->
        (
            append([Move], Aux, NewAux),
            winning_moves(Board, Player, ListOfMoves, NewAux, ListOfWinningMoves)
        );
        winning_moves(Board, Player, ListOfMoves, Aux, ListOfWinningMoves)
    ).

/**
 * Evaluates Board from Player's perspective, according to its valid moves, winning moves, losing moves and if he wins right away
 * Returns result as Value
 */
value(Board, Player, Value) :-
    (checkWin(Board) ->
        Value is 999999;
        (
            value_valid_moves(Board, Player, Moves, Valid),
            value_winning_moves(Board, Player, Moves, Winning),
            value_losing_moves(Board, Player, Moves, Losing),
            UpdatedValid is (Valid - Winning - Losing),
            Value is (UpdatedValid + Winning*100 - Losing*100)
        )
    ).

/**
 * Gets the number of valid moves of a Board in a Player's perspective
 */
value_valid_moves(Board, Player, ListOfMoves, Value) :-
    valid_moves(Board, Player, ListOfMoves),
    length(ListOfMoves, Value).

/**
 * Gets the number of winning moves of a Board in a Player's perspective
 */
value_winning_moves(Board, Player, ListOfMoves, Value) :-
    winning_moves(Board, Player, ListOfMoves, [], ListOfWinningMoves),
    length(ListOfWinningMoves, Value).

/**
 * Gets the number of losing moves of a Board in a Player's perspective
 */
value_losing_moves(Board, Player, ListOfMoves, Value) :-
    losing_moves(Board, Player, ListOfMoves, [], ListOfLosingMoves),
    length(ListOfLosingMoves, Value).

/**
 * Chooses move for level Easy (1), meaning it randomly chooses a valid move
 */
choose_move(Board, 1, Move) :-
    getCurrentPlayer(Board, Player),
    valid_moves(Board, Player, ListOfMoves),
    random_member(Move, ListOfMoves).

/**
 * Chooses a move for levels Medium and Hard by getting all valid moves and choosing the best one
 * If there isn't a best move, it just chooses a random valid move
 */
choose_move(Board, Level, Move) :-
    getCurrentPlayer(Board, Player),
    valid_moves(Board, Player, ListOfMoves),
    NewLevel is Level-1,
    best_move(Board, Player, NewLevel, ListOfMoves, -999999, _MaxValue, [], BestMove),
    (BestMove \= 0 ->
        Move = BestMove;
        random_member(Move, ListOfMoves)
    ).

/**
 * Chooses the best move in Board from Player's perspective, searching recursively for the move that gives him the quickest victory
 * and predicting what move the opponent will play
 * Returns the BestMove and the Value of the board this move leads to
 */
best_move(_Board, _Player, _Level, [], Curr_MaxValue, Curr_MaxValue, Curr_BestMove, BestMove) :-
    length(Curr_BestMove, L),
    (L \= 0 ->
        random_member(BestMove, Curr_BestMove);
        BestMove = 0
    ).

best_move(Board, Player, 1, [Move | ListOfMoves], Curr_MaxValue, MaxValue, Curr_BestMove, BestMove) :-
    move(Move, Board, NewBoard),
    value(NewBoard, Player, Value),
    (Value > Curr_MaxValue ->
        best_move(Board, Player, 1, ListOfMoves, Value, MaxValue, [Move], BestMove);
        (Value =:= Curr_MaxValue ->
            best_move(Board, Player, 1, ListOfMoves, Value, MaxValue, [Move | Curr_BestMove], BestMove);
            best_move(Board, Player, 1, ListOfMoves, Curr_MaxValue, MaxValue, Curr_BestMove, BestMove)
        )
    ).

best_move(Board, Player, Depth, [Move | ListOfMoves], Curr_MaxValue, MaxValue, Curr_BestMove, BestMove) :-
    Depth =\= 1,
    NewDepth is Depth - 1,
    move(Move, Board, NewBoard),
    write('.'),
    (checkWin(NewBoard) ->
        best_move(Board, Player, Depth, [], 999999, MaxValue, [Move], BestMove);
        (
            opponent_best_move(NewBoard, Player, NewDepth, OpponentBoard),
            (checkWin(OpponentBoard) ->
                best_move(Board, Player, Depth, ListOfMoves, Curr_MaxValue, MaxValue, Curr_BestMove, BestMove);
                (
                    valid_moves(OpponentBoard, Player, ListOfNextMoves),
                    best_move(OpponentBoard, Player, NewDepth, ListOfNextMoves, -999999, Value, _Aux, _NextMove),
                    (Value > Curr_MaxValue ->
                        best_move(Board, Player, Depth, ListOfMoves, Value, MaxValue, [Move], BestMove);
                        (Value =:= Curr_MaxValue ->
                            best_move(Board, Player, Depth, ListOfMoves, Value, MaxValue, [Move | Curr_BestMove], BestMove);
                            best_move(Board, Player, Depth, ListOfMoves, Curr_MaxValue, MaxValue, Curr_BestMove, BestMove)
                        )
                    )
                )
            )
        )
    ).

/**
 * Gets the opponent best move, presuming that it will be the one it will play
 */
opponent_best_move(Board, Player, Depth, OpponentBoard) :-
    getOpponentPlayer(Player, OpponentPlayer),
    switchPlayer(Board, NextBoard),
    valid_moves(NextBoard, OpponentPlayer, ListOfOpponentMoves),
    best_move(NextBoard, OpponentPlayer, Depth, ListOfOpponentMoves, -999999, _MaxValue, _Aux, Move),
    move(Move, NextBoard, NextBoard2),
    switchPlayer(NextBoard2, OpponentBoard).
