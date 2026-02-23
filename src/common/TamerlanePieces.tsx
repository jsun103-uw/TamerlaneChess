import { Board, BOARD_FILES, TamerlanePiece } from "./Board";
import { MoveUnion, TakeMove } from "./Move";
import { opposingPlayerTo, Player } from "./Player";
import { BoardPosition, PositionUnion } from "./Position";

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
    static Elephant: TamerlanePieceType = TamerlanePieces.createPiece(
        "E",
        "Elephant",
        (board: Board, position: PositionUnion, side: Player) => (TamerlanePieces.getMovesDiagonal(board, position, side, 1, 2)),
    );
    static Camel: TamerlanePieceType = TamerlanePieces.createPiece(
        "C",
        "Camel",
        TamerlanePieces.getMovesStub,
    );
    static Dabbaba: TamerlanePieceType = TamerlanePieces.createPiece(
        "D",
        "Dabbaba",
        TamerlanePieces.getMovesStub,
    );
    static Rook: TamerlanePieceType = TamerlanePieces.createPiece(
        "R",
        "Rook",
        TamerlanePieces.getMovesStub,
    );
    static Picket: TamerlanePieceType = TamerlanePieces.createPiece(
        "B",
        "Picket",
        (board: Board, position: PositionUnion, side: Player) => (TamerlanePieces.getMovesDiagonal(board, position, side, 1, BOARD_FILES)),
    );
    static Knight: TamerlanePieceType = TamerlanePieces.createPiece(
        "N",
        "Knight",
        TamerlanePieces.getMovesStub,
    );
    static Giraffe: TamerlanePieceType = TamerlanePieces.createPiece(
        "F",
        "Giraffe",
        TamerlanePieces.getMovesStub,
    );
    static General: TamerlanePieceType = TamerlanePieces.createPiece(
        "G",
        "General",
        (board: Board, position: PositionUnion, side: Player) => (TamerlanePieces.getMovesDiagonal(board, position, side, 0, 1)),
    );
    static Vizier: TamerlanePieceType = TamerlanePieces.createPiece(
        "V",
        "Vizier",
        TamerlanePieces.getMovesStub,
    );



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

    static King: TamerlanePieceType = TamerlanePieces.createRoyal(
        "K",
        "King",
        TamerlanePieces.getMovesStub,
    );
    static Prince: TamerlanePieceType = TamerlanePieces.createRoyal(
        "P",
        "Prince",
        TamerlanePieces.getMovesStub,
    );
    static AdventitiousKing: TamerlanePieceType = TamerlanePieces.createRoyal(
        "A",
        "Adventitious King",
        TamerlanePieces.getMovesStub,
    );

    static PawnOfKing: PawnType = TamerlanePieces.createPawnNamed(
        TamerlanePieces.Prince,
        "k",
        "Pawn of Kings",
        TamerlanePieces.getMovesStub,
    );
    static PawnOfPawns: PawnType = TamerlanePieces.createPawnNamed(
        TamerlanePieces.AdventitiousKing,
        "p",
        "Pawn of Pawns",
        TamerlanePieces.getMovesStub,
    );

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
            getMoves
        );
        Object.freeze(pawn);
        return pawn;
    }
    private static createPawn(promotion: TamerlanePieceType): PawnType {
        let pawn = new PawnType(
            promotion,
            promotion.charRep.toLowerCase(),
            `Pawn of ${promotion.name}s`,
            TamerlanePieces.getMovesStub
        );
        Object.freeze(pawn);
        return pawn;
    }

    private static *getMovesStub(board: Board, position: PositionUnion, side: Player): Generator<MoveUnion> {
        return;
    }
    //#endregion 
    private static *getMovesPawn(board: Board, position: PositionUnion, max: number): Generator<MoveUnion> {
        if (position.kind != "board") return;
        for (let i = 1; i < BOARD_FILES; i ++) {
            if (BoardPosition.valid(position.rank + i, position.file + i)) 
                yield new TakeMove(position, new BoardPosition(position.rank + i, position.file + i));
            if (BoardPosition.valid(position.rank + i, position.file - i)) 
                yield new TakeMove(position, new BoardPosition(position.rank + i, position.file - i));
            if (BoardPosition.valid(position.rank - i, position.file - i)) 
                yield new TakeMove(position, new BoardPosition(position.rank - i, position.file - i));
            if (BoardPosition.valid(position.rank - i, position.file + i)) 
                yield new TakeMove(position, new BoardPosition(position.rank - i, position.file + i));
        }
    }

    /**
     * returns a generator of moves on the diagonal of the position.
     * @param side The player side of the piece being moved
     * @param max maximum spaces to move
     * @param min minimum spaces that must be clear
     * @returns list of pseudo legal moves
     */
    private static *getMovesDiagonal(board: Board, position: PositionUnion, side: Player, min: number, max: number): Generator<MoveUnion> {
        if (position.kind != "board") return;

        yield* this.getLine(board, position, side, min, max, (i: number) => BoardPosition.trymake(position.rank + i, position.file + i));
        yield* this.getLine(board, position, side, min, max, (i: number) => BoardPosition.trymake(position.rank + i, position.file - i));
        yield* this.getLine(board, position, side, min, max, (i: number) => BoardPosition.trymake(position.rank - i, position.file - i));
        yield* this.getLine(board, position, side, min, max, (i: number) => BoardPosition.trymake(position.rank - i, position.file + i));
    }
    /**
     * Starts at position. May move up to max steps until it hits a border, enemy, or its own piece. min steps must be clear.
     * @param board state of the board
     * @param position position of the piece being moved
     * @param side side of the piece being moved
     * @param min steps that must be empty
     * @param max maximum steps to travel
     * @param posFunc position iterator. Determines what each step is
     * @returns 
     */
    private static *getLine(board: Board, position: BoardPosition, side: Player, min: number, max: number, posFunc: (i: number) => (BoardPosition | null)): Generator<MoveUnion> {
        for (let i = 1; i <= min; i ++) {
            const pos = posFunc(i);
            // if (pos != null) console.log(board.getPiece(pos));
            // if position doesn't exist or the position is occupied in min, do not move.
            if (pos === null || board.getPiece(pos) != null) return;
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
    
}