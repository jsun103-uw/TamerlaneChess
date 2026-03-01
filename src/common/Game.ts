import { Board, PositionedTamerlanePiece, TamerlanePiece } from "./Board";
import { MoveUnion } from "./Move";
import { opposingPlayerTo, Player, PlayerENUM } from "./Player";
import { PositionUnion } from "./Position";

export class Game {
    #board: Board;
    #turn: Player;
    public get turn(): Player { return this.#turn; }

    #turnNumber: number = 1;
    public get turnNumber() { return this.#turnNumber; }

    #whiteTaken: TamerlanePiece[];
    #blackTaken: TamerlanePiece[];

    public constructor() {
        this.#board = Board.buildStartingBoard();
        this.#turn = PlayerENUM.White;

        this.#whiteTaken = [];
        this.#blackTaken = [];
    }

    public *getMovesFor(position: PositionUnion): Generator<MoveUnion> {
        yield* this.#board.getMoves(position, this.#turn);
    }
    public trymove(move: MoveUnion): boolean {
        const result = this.#board.trymove(move, this.#turn);
        if (result.successful) {
            this.#turn = opposingPlayerTo(this.turn);
            if (this.#turn === PlayerENUM.White) this.#turnNumber ++;
            return true;
        }
        return false;
    }

    public debugGetBoard(): string { 
        return this.#board.debugGet(); 
    }
    public *getPieces(): Generator<PositionedTamerlanePiece> { 
        yield* this.#board.getPieces(); 
    }

    public debugBoardReference(): Board {
        return this.#board;
    }
}