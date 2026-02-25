import { Board } from "./Board";
import { MoveUnion } from "./Move";
import { PositionUnion } from "./Position";

class Game {
    #board: Board;

    public constructor() {
        this.#board = Board.buildStartingBoard();
    }

    public *getMovesFor(position: PositionUnion): Generator<MoveUnion> {
        if (this.#board.getMoves(position)) {
            
        }
    }
}