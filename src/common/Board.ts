

// [File][Rank]

import { MoveUnion, TakeMove } from "./Move";
import { opposingPlayerTo, Player, PlayerENUM } from "./Player";
import { BoardPosition, Citadel, CitadelPosition, Position, PositionUnion } from "./Position";
import { PawnType, TamerlanePieces, TamerlanePieceType } from "./TamerlanePieces";

export const BOARD_FILES = 11;
export const BOARD_RANKS = 10;
export class Board {
    #field: BoardPiece[][];
    #citadelLeft: Citadel;
    #citadelRight: Citadel;

    public getPiece(position: PositionUnion): BoardPiece {
        //If citadel, return the piece in the correct citadel position
        if (position.kind === "citadel") {
            return this.#citadelLeft.position === position 
                ? this.#citadelLeft.piece 
                : this.#citadelRight.piece;
        }
        else if (position.kind === "board") {
            return this.#field[position.file][position.rank]
        }
        throw new TypeError(`${typeof position} is not a valid position kind`);
    }
    /**
     * Gets all legal moves at the position for side
     * @param position 
     * @returns 
     */
    public *getMoves(position: PositionUnion, side: Player): Generator<MoveUnion> {
        const piece = this.getPiece(position);
        if (piece === null || piece.side !== side) return;
        const moves = piece.piece.getMoves(this, position, piece.side);
        yield* moves;
    }
    private setPiece(position: PositionUnion, piece: BoardPiece) {
        //If citadel, set the piece in the correct citadel position
        if (position.kind === "citadel") {
            if (this.#citadelLeft.position === position) this.#citadelLeft.piece = piece;
            else this.#citadelRight.piece = piece;
        }
        else if (position.kind === "board") {
            this.#field[position.file][position.rank] = piece;
        }
        else throw new TypeError(`${typeof position} is not a valid position kind`);
    }


    private constructor() {
        this.#field = new Array<BoardPiece[]>(BOARD_FILES);
        for (let i = 0; i < BOARD_FILES; i ++) {
            this.#field[i] = new Array<BoardPiece>(BOARD_RANKS)
            this.#field[i].fill(null);
        }
        this.#citadelLeft = new Citadel(CitadelPosition.getLeft())
        this.#citadelRight = new Citadel(CitadelPosition.getRight())
    }

    public static buildStartingBoard(): Board {
        let board = new Board();
        board.#field[0][0] = TamerlanePieces.Elephant.makeActive(PlayerENUM.White);
        board.#field[2][0] = TamerlanePieces.Camel.makeActive(PlayerENUM.White);
        board.#field[4][0] = TamerlanePieces.Dabbaba.makeActive(PlayerENUM.White);
        board.#field[6][0] = TamerlanePieces.Dabbaba.makeActive(PlayerENUM.White);
        board.#field[8][0] = TamerlanePieces.Camel.makeActive(PlayerENUM.White);
        board.#field[10][0] = TamerlanePieces.Elephant.makeActive(PlayerENUM.White);


        board.#field[0][1] = TamerlanePieces.Rook.makeActive(PlayerENUM.White);
        board.#field[1][1] = TamerlanePieces.Knight.makeActive(PlayerENUM.White);
        board.#field[2][1] = TamerlanePieces.Picket.makeActive(PlayerENUM.White);
        board.#field[3][1] = TamerlanePieces.Giraffe.makeActive(PlayerENUM.White);
        board.#field[4][1] = TamerlanePieces.Vizier.makeActive(PlayerENUM.White);
        board.#field[5][1] = TamerlanePieces.King.makeActive(PlayerENUM.White);
        board.#field[6][1] = TamerlanePieces.General.makeActive(PlayerENUM.White);
        board.#field[7][1] = TamerlanePieces.Giraffe.makeActive(PlayerENUM.White);
        board.#field[8][1] = TamerlanePieces.Picket.makeActive(PlayerENUM.White);
        board.#field[9][1] = TamerlanePieces.Knight.makeActive(PlayerENUM.White);
        board.#field[10][1] = TamerlanePieces.Rook.makeActive(PlayerENUM.White);


        board.#field[0][2] = TamerlanePieces.PawnOfPawns.makeActive(PlayerENUM.White);
        board.#field[1][2] = TamerlanePieces.PawnOfDabbaba.makeActive(PlayerENUM.White);
        board.#field[2][2] = TamerlanePieces.PawnOfCamel.makeActive(PlayerENUM.White);
        board.#field[3][2] = TamerlanePieces.PawnOfElephant.makeActive(PlayerENUM.White);
        board.#field[4][2] = TamerlanePieces.PawnOfVizier.makeActive(PlayerENUM.White);
        board.#field[5][2] = TamerlanePieces.PawnOfKing.makeActive(PlayerENUM.White);
        board.#field[6][2] = TamerlanePieces.PawnOfGeneral.makeActive(PlayerENUM.White);
        board.#field[7][2] = TamerlanePieces.PawnOfGiraffe.makeActive(PlayerENUM.White);
        board.#field[8][2] = TamerlanePieces.PawnOfPicket.makeActive(PlayerENUM.White);
        board.#field[9][2] = TamerlanePieces.PawnOfKnight.makeActive(PlayerENUM.White);
        board.#field[10][2] = TamerlanePieces.PawnOfRook.makeActive(PlayerENUM.White);

        //* Black

        board.#field[0][9] = TamerlanePieces.Elephant.makeActive(PlayerENUM.Black);
        board.#field[2][9] = TamerlanePieces.Camel.makeActive(PlayerENUM.Black);
        board.#field[4][9] = TamerlanePieces.Dabbaba.makeActive(PlayerENUM.Black);
        board.#field[6][9] = TamerlanePieces.Dabbaba.makeActive(PlayerENUM.Black);
        board.#field[8][9] = TamerlanePieces.Camel.makeActive(PlayerENUM.Black);
        board.#field[10][9] = TamerlanePieces.Elephant.makeActive(PlayerENUM.Black);


        board.#field[0][8] = TamerlanePieces.Rook.makeActive(PlayerENUM.Black);
        board.#field[1][8] = TamerlanePieces.Knight.makeActive(PlayerENUM.Black);
        board.#field[2][8] = TamerlanePieces.Picket.makeActive(PlayerENUM.Black);
        board.#field[3][8] = TamerlanePieces.Giraffe.makeActive(PlayerENUM.Black);
        board.#field[4][8] = TamerlanePieces.General.makeActive(PlayerENUM.Black);
        board.#field[5][8] = TamerlanePieces.King.makeActive(PlayerENUM.Black);
        board.#field[6][8] = TamerlanePieces.Vizier.makeActive(PlayerENUM.Black);
        board.#field[7][8] = TamerlanePieces.Giraffe.makeActive(PlayerENUM.Black);
        board.#field[8][8] = TamerlanePieces.Picket.makeActive(PlayerENUM.Black);
        board.#field[9][8] = TamerlanePieces.Knight.makeActive(PlayerENUM.Black);
        board.#field[10][8] = TamerlanePieces.Rook.makeActive(PlayerENUM.Black);


        board.#field[0][7] = TamerlanePieces.PawnOfRook.makeActive(PlayerENUM.Black);
        board.#field[1][7] = TamerlanePieces.PawnOfKnight.makeActive(PlayerENUM.Black);
        board.#field[2][7] = TamerlanePieces.PawnOfPicket.makeActive(PlayerENUM.Black);
        board.#field[3][7] = TamerlanePieces.PawnOfGiraffe.makeActive(PlayerENUM.Black);
        board.#field[4][7] = TamerlanePieces.PawnOfGeneral.makeActive(PlayerENUM.Black);
        board.#field[5][7] = TamerlanePieces.PawnOfKing.makeActive(PlayerENUM.Black);
        board.#field[6][7] = TamerlanePieces.PawnOfVizier.makeActive(PlayerENUM.Black);
        board.#field[7][7] = TamerlanePieces.PawnOfElephant.makeActive(PlayerENUM.Black);
        board.#field[8][7] = TamerlanePieces.PawnOfCamel.makeActive(PlayerENUM.Black);
        board.#field[9][7] = TamerlanePieces.PawnOfDabbaba.makeActive(PlayerENUM.Black);
        board.#field[10][7] = TamerlanePieces.PawnOfPawns.makeActive(PlayerENUM.Black);
        return board;
    }

    public debugGet(): string {
        let boardstr: string = "";
        for (let rank = BOARD_RANKS - 1; rank >= 0; rank --) {
            let items: string = "";
            // citadel space
            if (rank === this.#citadelLeft.position.rank) {
                items += this.#citadelLeft.piece === null 
                    ? "." : this.#citadelLeft.piece.charRep;
            }
            else items += "█";

            // board
            for (let file = 0; file < BOARD_FILES; file ++) {
                let piece = this.getPiece(new BoardPosition(file, rank));
                items += (piece == null) 
                    ? "." : piece.charRep;
            }

            // citadel space

            if (rank === this.#citadelRight.position.rank) {
                items += this.#citadelRight.piece === null 
                    ? "." : this.#citadelRight.piece.charRep;
            }
            else items += "█";
            boardstr += items + "\n";
            // console.log(`R${rank}`)
        }
        return boardstr;
    }
    public *getPieces(): Generator<PositionedTamerlanePiece> {
        for (let i = 0; i < BOARD_FILES; i ++) {
            for (let j = 0; j < BOARD_RANKS; j ++) {
                let piece = this.#field[i][j];
                if (piece != null) yield new PositionedTamerlanePiece(new BoardPosition(i, j), piece);
            }
        }
        if (this.#citadelLeft.piece != null) yield new PositionedTamerlanePiece(this.#citadelLeft.position, this.#citadelLeft.piece);
        if (this.#citadelRight.piece != null) yield new PositionedTamerlanePiece(this.#citadelLeft.position, this.#citadelRight.piece);
    }

    //#region //* Movement

    /**
     * Attempts to execute move for side
     * @returns the result of the move
     */
    public trymove(move: MoveUnion, side: Player): MoveResult {
        if (Board.containsMove(this.getMoves(move.start, side), move))
        {
            this.move(move);
            return new MoveResult(true, null);
        }
        return new MoveResult(false, null);
    }
    /**
     * Executes the move. If a piece has been taken, return it.
     * @param move 
     */
    private move(move: MoveUnion): BoardPiece {
        let taken: BoardPiece = null;
        if (move.kind === "take") {
            // replaces piece at end with start, returning it
            taken = this.getPiece(move.end);
            this.setPiece(move.end, this.getPiece(move.start));
            this.setPiece(move.start, null);
        }
        else if (move.kind === "exchange") {
            // swaps end and start
            let atEnd = this.getPiece(move.end);
            this.setPiece(move.end, this.getPiece(move.start));
            this.setPiece(move.start, atEnd);
        }
        else throw new TypeError(`${typeof move} does not have a valid move kind`);
        this.applyPostMoveRules(move);
        return taken;
        // return null;
    }
    private applyPostMoveRules(move: MoveUnion) {
        this.checkPromote(move.end);
        this.checkPromote(move.start);
    }
    private checkPromote(position: BoardPosition) {
        const piece = this.getPiece(position);
        if (piece === null || !(piece.piece instanceof PawnType)) return;

        if (position.rank === 0 && piece.side === PlayerENUM.Black) { 
            this.setPiece(position, piece.piece.promotion.makeActive(PlayerENUM.Black))
        }
        else if (position.rank === 9 && piece.side === PlayerENUM.White) { 
            this.setPiece(position, piece.piece.promotion.makeActive(PlayerENUM.White))
        }
    }

    private static containsMove(moves: Iterable<MoveUnion>, search: MoveUnion): boolean {
        for(const move of moves) {
            if (move.kind === search.kind) {
                if (move.kind === "exchange" || move.kind === "take") {
                    if (move.end.equals(search.end) && move.start.equals(search.start)) return true; 
                }
            }
        }
        return false;
    }
    /**
     * returns true if moves has a move that ends at target
     */
    private static containsMoveTo(moves: Iterable<MoveUnion>, target: PositionUnion): boolean {
        for(const move of moves) {
            if (target.kind === "board") {
                if (move.kind === "exchange" || move.kind === "take") {
                    if (move.end.equals(target)) return true; 
                }
            }
        }
        return false;
    }

    //#endregion

    /**
     * Checks if side's sole royal is being attacked
     */
    public checkCheck(side: Player): boolean {
        // get sole king
        let king: PositionedTamerlanePiece | null = null;
        for(const active of this.getPieces()) {
            if (active.piece.royal && active.side === side) {
                if (king === null) king = active;
                else return false; // Cannot be in check if there are multiple royals
            }
        }
        if (king === null) {
            console.error(`royal is missing from board`);
            return false; // no king 
        }
        const enemy = opposingPlayerTo(side);
        for(const active of this.getPieces()) {
            if (active.side === enemy && Board.containsMoveTo(active.piece.getMoves(this, active.position, enemy), king.position)) {
                return true;
            }
        }
        return false;
    }
}

export class MoveResult {
    #successful : boolean;
    #taken : BoardPiece;
    /**
     * If this move was succesful.
     */
    get successful() { return this.#successful; }
    /**
     * The piece that was taken in this move, if any
     */
    get taken() { return this.#taken; }
    constructor(succesful: boolean, taken: BoardPiece) {
        this.#successful = succesful;
        this.#taken = taken;

    }
}

export type BoardPiece = TamerlanePiece | null
/**
 * A tamerlane piece that belongs to a player
 */
export class TamerlanePiece {
    #piece: TamerlanePieceType;
    #side: Player;

    get charRep() {
        return this.piece.charRep;
    }

    get piece() {
        return this.#piece;
    }
    get side() {
        return this.#side;
    }

    constructor(piece: TamerlanePieceType, side: Player) {
        this.#side = side;
        this.#piece = piece;
    }

    toString(): string {
        return `${this.charRep}:${this.side}`;
    }
}

export class PositionedTamerlanePiece {
    public readonly position: PositionUnion;
    public readonly piece: TamerlanePieceType;
    public readonly side: Player;

    public constructor(position: PositionUnion, piece: TamerlanePiece) {
        this.position = position;
        this.side = piece.side;
        this.piece = piece.piece;
    }

    public toString(): string {
        return `${this.piece.charRep}:${this.side}:${this.position}`;
    }
}
