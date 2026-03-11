import { Board, TamerlanePiece } from "./Board.js";
import { BOARD_FILES } from "./Consts.js";
import { MoveUnion, TakeMove } from "./Move.js";
import { opposingPlayerTo, Player, PlayerENUM } from "./Player.js";
import { BoardPosition, PositionUnion } from "./Position.js";

export class TamerlanePieceType {
    public readonly charRep: string;
    public readonly name: string;
    public royal: boolean = false;
    /**
     * returns a list of pseudo legal moves. Conditions such as checks are handled by the game.
     */
    public readonly getMoves: MoveRequestFunc;
    constructor(charRep: string, name: string, getMoves: MoveRequestFunc) {
        this.charRep = charRep;
        this.name = name;
        this.getMoves = getMoves;
    }

    makeActive(player: Player) {
        return new TamerlanePiece(this, player);
    }
}

export class PawnType extends TamerlanePieceType {
    promotion: TamerlanePieceType;
    constructor(promotion: TamerlanePieceType,
        charRep: string, name: string, getMoves: MoveRequestFunc) {
        super(charRep, name, getMoves);
        this.promotion = promotion;
    }
}

type MoveRequestFunc = (board: Board, position: PositionUnion, side: Player) => Generator<MoveUnion>;

export class TamerlanePieces {
    //#region main units
    static Elephant: TamerlanePieceType = TamerlanePieces.createPiece(
        "E",
        "Elephant",
        (board: Board, position: PositionUnion, side: Player) => (TamerlanePieces.getMovesDiagonal(board, position, side, 1, 2, true)),
    );
    static Camel: TamerlanePieceType = TamerlanePieces.createPiece(
        "C",
        "Camel",
        (board: Board, position: PositionUnion, side: Player) => (TamerlanePieces.getMovesKnightlike(board, position, side, 2, 3, true)),
    );
    static Dabbaba: TamerlanePieceType = TamerlanePieces.createPiece(
        "D",
        "Dabbaba",
        (board: Board, position: PositionUnion, side: Player) => (TamerlanePieces.getMovesOrthogonal(board, position, side, 1, 2, true)),
    );
    static Rook: TamerlanePieceType = TamerlanePieces.createPiece(
        "R",
        "Rook",
        (board: Board, position: PositionUnion, side: Player) => (TamerlanePieces.getMovesOrthogonal(board, position, side, 0, BOARD_FILES)),
    );
    static Picket: TamerlanePieceType = TamerlanePieces.createPiece(
        "B",
        "Picket",
        (board: Board, position: PositionUnion, side: Player) => (TamerlanePieces.getMovesDiagonal(board, position, side, 1, BOARD_FILES)),
    );
    static Knight: TamerlanePieceType = TamerlanePieces.createPiece(
        "N",
        "Knight",
        (board: Board, position: PositionUnion, side: Player) => (TamerlanePieces.getMovesKnightlike(board, position, side, 1, 2, true)),
    );
    static Giraffe: TamerlanePieceType = TamerlanePieces.createPiece(
        "F",
        "Giraffe",
        (board: Board, position: PositionUnion, side: Player) => (TamerlanePieces.getMovesKnightlike(board, position, side, 3, BOARD_FILES, false)),
    );
    static General: TamerlanePieceType = TamerlanePieces.createPiece(
        "G",
        "General",
        (board: Board, position: PositionUnion, side: Player) => (TamerlanePieces.getMovesDiagonal(board, position, side, 0, 1)),
    );
    static Vizier: TamerlanePieceType = TamerlanePieces.createPiece(
        "V",
        "Vizier",
        (board: Board, position: PositionUnion, side: Player) => (TamerlanePieces.getMovesOrthogonal(board, position, side, 0, 1)),
    );

    //#endregion

    //#region pawn units

    static PawnOfElephant: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.Elephant
    );
    static PawnOfCamel: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.Camel
    );
    static PawnOfDabbaba: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.Dabbaba
    );
    static PawnOfRook: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.Rook
    );
    static PawnOfPicket: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.Picket
    );
    static PawnOfKnight: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.Knight
    );
    static PawnOfGiraffe: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.Giraffe
    );
    static PawnOfGeneral: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.General
    );
    static PawnOfVizier: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.Vizier
    );

    //#endregion

    //#region king and specil units
    static King: TamerlanePieceType = TamerlanePieces.createRoyal(
        "K",
        "King",
        (board: Board, position: PositionUnion, side: Player) => TamerlanePieces.getMovesKing(board, position, side),
    );
    static Prince: TamerlanePieceType = TamerlanePieces.createRoyal(
        "P",
        "Prince",
        (board: Board, position: PositionUnion, side: Player) => TamerlanePieces.getMovesKing(board, position, side),
    );
    static AdventitiousKing: TamerlanePieceType = TamerlanePieces.createRoyal(
        "A",
        "Adventitious King",
        (board: Board, position: PositionUnion, side: Player) => TamerlanePieces.getMovesKing(board, position, side),
    );

    static PawnOfKing: PawnType = TamerlanePieces.createPawnNamed(
        TamerlanePieces.Prince,
        "k",
        "Pawn of Kings",
        TamerlanePieces.getMovesPawn,
    );
    static PawnOfPawns: PawnType = TamerlanePieces.createPawnNamed(
        TamerlanePieces.AdventitiousKing,
        "p",
        "Pawn of Pawns",
        TamerlanePieces.getMovesPawn,
    );
    
    //#endregion

    //#region creating pieces mathods

    private static createPiece(charRep: string, name: string, getMoves: MoveRequestFunc): TamerlanePieceType {
        let piece = new TamerlanePieceType(charRep, name, getMoves);
        Object.freeze(piece);
        return piece;
    }
    private static createRoyal(charRep: string, name: string, getMoves: MoveRequestFunc): TamerlanePieceType {
        let piece = new TamerlanePieceType(charRep, name, getMoves);
        piece.royal = true;
        Object.freeze(piece);
        return piece;
    }
    private static createPawnNamed(promotion: TamerlanePieceType, charRep: string, name: string, getMoves: MoveRequestFunc): PawnType {
        let pawn = new PawnType(
            promotion,
            charRep,
            name,
            this.getMovesPawn,
        );
        Object.freeze(pawn);
        return pawn;
    }
    private static createPawn(promotion: TamerlanePieceType): PawnType {
        let pawn = new PawnType(
            promotion,
            promotion.charRep.toLowerCase(),
            `Pawn of ${promotion.name}s`,
            this.getMovesPawn,
        );
        Object.freeze(pawn);
        return pawn;
    }

    //#endregion 

    //#region move generators
    private static *getMovesKing(board: Board, position: PositionUnion, side: Player): Generator<MoveUnion> {
        yield *this.getMovesDiagonal(board, position, side, 0, 1);
        yield *this.getMovesOrthogonal(board, position, side, 0, 1);
    }
    private static *getMovesPawn(board: Board, position: PositionUnion, side: Player): Generator<MoveUnion> {
        if (position.kind !== "board") return;
        
        let direction = 1;
        if (side === PlayerENUM.White) direction = 1;
        else if (side === PlayerENUM.Black) direction = -1;

        const attack1:  (BoardPosition | null) = BoardPosition.trymake(position.file + 1, position.rank + direction);;
        const attack2:  (BoardPosition | null) = BoardPosition.trymake(position.file - 1, position.rank + direction);;
        const move:     (BoardPosition | null) = BoardPosition.trymake(position.file, position.rank + direction);

        if (attack1 !== null && board.getPiece(attack1)?.side === opposingPlayerTo(side)) yield new TakeMove(position, attack1);
        if (attack2 !== null && board.getPiece(attack2)?.side === opposingPlayerTo(side)) yield new TakeMove(position, attack2);
        if (move !== null && board.getPiece(move) === null) yield new TakeMove(position, move);
    }
    /**
     * returns a generator of moves on the orthogonal directions of the position.
     * @param side The player side of the piece being moved
     * @param max maximum spaces to move
     * @param min minimum spaces that must be clear
     * @returns list of pseudo legal moves
     */
    private static *getMovesOrthogonal(board: Board, position: PositionUnion, side: Player, min: number, max: number, jumpmin: boolean = false): Generator<MoveUnion> {
        if (position.kind !== "board") return;

        yield* this.getLine(board, position, side, min, max, jumpmin, (i: number) => BoardPosition.trymake(position.file, position.rank + i));
        yield* this.getLine(board, position, side, min, max, jumpmin, (i: number) => BoardPosition.trymake(position.file + i, position.rank));
        yield* this.getLine(board, position, side, min, max, jumpmin, (i: number) => BoardPosition.trymake(position.file, position.rank - i));
        yield* this.getLine(board, position, side, min, max, jumpmin, (i: number) => BoardPosition.trymake(position.file - i, position.rank));
    }

    /**
     * returns a generator of moves on the diagonal of the position.
     * @param side The player side of the piece being moved
     * @param max maximum spaces to move
     * @param min minimum spaces that must be clear
     * @returns list of pseudo legal moves
     */
    private static *getMovesDiagonal(board: Board, position: PositionUnion, side: Player, min: number, max: number, jumpmin: boolean = false): Generator<MoveUnion> {
        if (position.kind !== "board") return;

        yield* this.getLine(board, position, side, min, max, jumpmin, (i: number) => BoardPosition.trymake(position.file + i, position.rank + i));
        yield* this.getLine(board, position, side, min, max, jumpmin, (i: number) => BoardPosition.trymake(position.file - i, position.rank + i));
        yield* this.getLine(board, position, side, min, max, jumpmin, (i: number) => BoardPosition.trymake(position.file - i, position.rank - i));
        yield* this.getLine(board, position, side, min, max, jumpmin, (i: number) => BoardPosition.trymake(position.file + i, position.rank - i));
    }
    /**
     * Starts at position. May move up to max steps until it hits a border, enemy, or its own piece. min steps must be clear.
     * @param board state of the board
     * @param position position of the piece being moved
     * @param side side of the piece being moved
     * @param min steps that must be empty
     * @param max maximum steps to travel
     * @param jumpmin if true, the piece will phase through (jump over) min steps. If false, min steps must be unoccupied
     *              For example, for the elephant this is true because it jumps diagonally, but for the picket this is false because one diagonal space must be unoccupied
     * @param posFunc position iterator. Determines what each step is
     * @returns 
     */
    private static *getLine(board: Board, position: BoardPosition, side: Player, min: number, max: number, jumpmin: boolean, posFunc: (i: number) => (BoardPosition | null)): Generator<MoveUnion> {
        for (let i = 1; i <= min; i ++) {
            const pos = posFunc(i);
            // if (pos !== null) console.log(board.getPiece(pos));
            // if position doesn't exist, or if the position is occupied and jumping is false, do not move.
            if (pos === null || (!jumpmin && board.getPiece(pos) !== null)) return;
        }
        for (let i = min + 1; i <= max; i ++) {
            const pos = posFunc(i);
            // if position doesn't exist, stop.
            if (pos === null) return;
            // if blocked by own piece, stop.
            const piece = board.getPiece(pos);
            if (piece?.side === side) return;
            yield new TakeMove(position, pos);
            // if the target piece is an enemy piece, take then stop
            if (piece?.side === opposingPlayerTo(side)) return;
        }
    }

    static #knightTemplates: KnightTemplate[] = [
        { diagonal: { file: -1, rank: 1, }, straight: { file: 0, rank: 1, }, },
        { diagonal: { file: -1, rank: 1, }, straight: { file: -1, rank: 0, }, },

        { diagonal: { file: 1, rank: -1, }, straight: { file: 0, rank: -1, }, },
        { diagonal: { file: 1, rank: -1, }, straight: { file: 1, rank: 0, }, },

        { diagonal: { file: 1, rank: 1, }, straight: { file: 0, rank: 1, }, },
        { diagonal: { file: 1, rank: 1, }, straight: { file: 1, rank: 0, }, },

        { diagonal: { file: -1, rank: -1, }, straight: { file: 0, rank: -1, }, },
        { diagonal: { file: -1, rank: -1, }, straight: { file: -1, rank: 0, }, },
    ]
    static #adjacents: Vector2I[] = [
        { file: 0, rank: 1, },
        { file: 0, rank: -1, },
        { file: 1, rank: 0, },
        { file: -1, rank: 0, },
    ]
    /**
     * returns moves wher the unit jumps in an L shape (1 diagonal, configurable orthogonal).
     * One step is one diagonal or orthogonal jump. E.g., the standard knight move is 2 steps (diagonal 1, orthogonal 1)
     * @param board 
     * @param position 
     * @param side 
     * @param min Number of steps this units must have travelled before being able to move
     * @param max How many steps can this piece travel in total.
     * @param jump How many steps this piece should be able to leap over.
     * @returns 
     */
    private static *getMovesKnightlike(board: Board, position: PositionUnion, side: Player, min: number, max: number, jumpmin: boolean): Generator<MoveUnion> {
        if (position.kind !== "board") return;

        for (const template of this.#knightTemplates) {
            yield* this.getLine(board, position, side, min, max, jumpmin, (i: number) => this.getLeap(position, template.diagonal, template.straight, i));
        }
    }
    private static getLeap(position: BoardPosition, initial: Vector2I, later: Vector2I, step: number): BoardPosition | null {
        if (step <= 0) return position;
        else if (step === 1) 
            return BoardPosition.trymake(
                position.file + initial.file, 
                position.rank + initial.rank,
            );
        else {
            return BoardPosition.trymake(
                position.file + initial.file + later.file * (step - 1), 
                position.rank + initial.rank + later.rank * (step - 1),
            );
        }
    }
    //#endregion
    
}
type Vector2I = {
    file: number,
    rank: number,
}
type KnightTemplate = {
    diagonal: Vector2I,
    straight: Vector2I,
}