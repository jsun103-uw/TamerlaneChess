import { Board, PositionedTamerlanePiece, TamerlanePiece } from "./Board.js";
import { MoveUnion } from "./Move.js";
import { opposingPlayerTo, Player, PlayerENUM } from "./Player.js";
import { PositionUnion } from "./Position.js";
import { TamerlanePieceType } from "./TamerlanePieces.js";

export class Game {
    #board: Board;
    #turn: Player;
    public get turn(): Player { return this.#turn; }

    #turnNumber: number = 1;
    public get turnNumber() { return this.#turnNumber; }

    #whiteTaken: TamerlanePieceType[];
    /**
     * @returns white pieces taken; taken by black
     */
    public getWhiteTaken(): Iterable<TamerlanePieceType> { return this.#whiteTaken; }

    #blackTaken: TamerlanePieceType[];
    /**
     * @returns black pieces taken; taken by white
     */
    public getBlackTaken(): Iterable<TamerlanePieceType> { return this.#blackTaken; }

    public constructor() {
        this.#board = Board.buildStartingBoard();
        this.#turn = PlayerENUM.White;

        this.#whiteTaken = [];
        this.#blackTaken = [];
    }

    public *getMovesFor(position: PositionUnion, side: Player): Generator<MoveUnion> {
        yield* this.#board.getMoves(position, side);
    }
    public trymove(move: MoveUnion): boolean {
        const result = this.#board.trymove(move, this.#turn);
        if (result.successful) {
            this.#turn = opposingPlayerTo(this.turn);

            if (result.taken) {
                if (result.taken.side === PlayerENUM.Black) this.#blackTaken.push(result.taken.piece)
                else this.#whiteTaken.push(result.taken.piece)
            }

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