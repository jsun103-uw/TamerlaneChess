import { Board, PositionedTamerlanePiece, TamerlanePiece } from "./Board.js";
import { GameResult } from "./GameResult.js";
import { MoveUnion } from "./Move.js";
import { opposingPlayerTo, Player, PlayerENUM } from "./Player.js";
import { PositionUnion } from "./Position.js";
import { TamerlanePieceType } from "./TamerlanePieces.js";

/**
 * Represents a tamerlane chess game with a board state, turn information, and statistics (pieces taken)
 */
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

    #checked: boolean = false;
    /**
     * Whether or not the side whose turn it is is checked
     */
    public get checked(): boolean { return this.#checked; }

    #checkmated: boolean = false;
    public get checkmated(): boolean { return this.#checkmated; }

    #citadelDraw: boolean = false;
    public get drawed(): boolean { return this.#citadelDraw; }

    public get gameend(): boolean { return this.checkmated || this.drawed; }

    /**
     * Conclusion of this game, does not account for resignations.
     * @param side conclusion for the side
     */
    public getResult(side: Player): GameResult | null {
        if (this.gameend) {
            if (this.drawed) return GameResult.Draw;
            else if (this.checkmated) {
                // If checkmated is true, the person whose turn it currently is, is the loser
                if (side === this.turn) return GameResult.Lost;
                return GameResult.Won; 
            }
        }
        return null;
    }

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
            // swap turn
            this.#turn = opposingPlayerTo(this.turn);

            // if a piece was taken, add to correct players taken store
            if (result.taken) {
                if (result.taken.side === PlayerENUM.Black) this.#blackTaken.push(result.taken.piece)
                else this.#whiteTaken.push(result.taken.piece)
            }

            this.#checked = this.#board.checkCheck(this.#turn);
            this.#checkmated = this.#board.checkMate(this.turn);

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