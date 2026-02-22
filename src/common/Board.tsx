

// [File][Rank]

export type PositionUnion = CitadelPosition | BoardPosition;
abstract class Position {
    abstract readonly kind: "board" | "citadel";
}

export const PlayerENUM = {
    White: "white",
    Black: "black",
} as const;
export type Player = typeof PlayerENUM.White | typeof PlayerENUM.Black;


export class CitadelPosition extends Position {
    readonly kind = "citadel" as const;
    #rank: number;
    get rank(): number { return this.#rank; }

    private constructor() {
        super();
        this.#rank = 0;
    }

    static getLeft(): CitadelPosition {
        var pos = new CitadelPosition();
        pos.#rank = 8; // rank 9, index 8.
        Object.freeze(pos);
        return pos;
    }
    static getRight(): CitadelPosition {
        var pos = new CitadelPosition();
        pos.#rank = 1; // rank 2, index 1.
        Object.freeze(pos);
        return pos;
    }

    equals(other: CitadelPosition): boolean {
        return this.#rank == other.#rank;
    }
}
class BoardPosition extends Position {
    readonly kind = "board" as const;
    #rank: number;
    #file: number;

    get rank(): number {
        return this.#rank;
    }
    get file(): number {
        return this.#file;
    }

    constructor(file: number, rank: number) {
        super();
        this.#file = file;
        this.#rank = rank;


        if (rank >= BOARD_RANKS || rank < 0) throw new RangeError(`Rank must be between 0 and ${BOARD_RANKS - 1}, but was ${rank}`)
        if (file >= BOARD_FILES || file < 0) throw new RangeError(`File must be between 0 and ${BOARD_FILES - 1}, but was ${file}`)
    }

    equals(other: BoardPosition): boolean {
        return this.rank === other.rank 
            && this.file === other.file;
    }

    static get rankNames(): string[] {
        return [ "A","B","C","D","E","F","G","H","I","J" ]
    }
    rankName(): string {
        return BoardPosition.rankNames[this.rank];
    }
    fileName(): string {
        return (this.file + 1).toString();
    }
    squareName(): string {
        return this.rankName() + this.fileName();
    }
}


class TakeMove {
    #start: BoardPosition;
    #end: BoardPosition;


    get start(): BoardPosition {
        return this.#start;
    }
    get end(): BoardPosition {
        return this.#end;
    }

    
    constructor(start: BoardPosition, end: BoardPosition) {
        this.#start = start;
        this.#end = end;
    }
}
class ExchangeMove extends TakeMove {
    constructor(start: BoardPosition, end: BoardPosition) {
        super(start, end);
    }
}


class Citadel {

    piece: BoardPiece;
    #position: CitadelPosition;
    get position() { return this.#position; }

    constructor(position: CitadelPosition) {
        this.#position = position;
        this.piece = null;
    }
}

const BOARD_FILES = 11;
const BOARD_RANKS = 10;
export class Board {
    #field: BoardPiece[][];
    #citadelLeft: Citadel;
    #citadelRight: Citadel;

    getPiece(position: PositionUnion): BoardPiece {
        //If citadel, return the piece in the correct citadel position
        if (position.kind === "citadel") {

            return this.#citadelLeft.position == position 
                ? this.#citadelLeft.piece 
                : this.#citadelRight.piece;
        }
        else if (position.kind === "board") {
            
            return this.#field[position.file][position.rank]
        }
        throw new TypeError(`${typeof position} is not a valid position kind`);
    }


    private constructor() {
        this.#field = new Array<BoardPiece[]>(BOARD_FILES);
        for (let i = 0; i < BOARD_FILES; i ++) {
            this.#field[i] = new Array<BoardPiece>(BOARD_RANKS)
        }
        this.#citadelLeft = new Citadel(CitadelPosition.getLeft())
        this.#citadelRight = new Citadel(CitadelPosition.getRight())
    }

    static buildStartingBoard(): Board {
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

    debugGet(): string {
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
}

type BoardPiece = ActiveTamerlanePiece | null
/**
 * An object that describes a tamerlane piece in play
 */
class ActiveTamerlanePiece {
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

    oneCharRep(): string {
        return "P";
    }
}


class TamerlanePieceType {
    charRep: string;
    name: string;
    royal: boolean = false;
    constructor(charRep: string, name: string) {
        this.charRep = charRep;
        this.name = name;
    }

    makeActive(player: Player) {
        return new ActiveTamerlanePiece(this, player);
    }
}
class PawnType extends TamerlanePieceType {
    promotion: TamerlanePieceType;
    constructor(promotion: TamerlanePieceType,
        charRep: string, name: string) {
        super(charRep, name)
        this.promotion = promotion;
    }
}

class TamerlanePieces {
    static Elephant: TamerlanePieceType = TamerlanePieces.createPiece(
        "E",
        "Elephant",
    );
    static Camel: TamerlanePieceType = TamerlanePieces.createPiece(
        "C",
        "Camel"
    )
    static Dabbaba: TamerlanePieceType = TamerlanePieces.createPiece(
        "D",
        "Dabbaba"
    )
    static Rook: TamerlanePieceType = TamerlanePieces.createPiece(
        "R",
        "Rook"
    )
    static Picket: TamerlanePieceType = TamerlanePieces.createPiece(
        "B",
        "Picket"
    )
    static Knight: TamerlanePieceType = TamerlanePieces.createPiece(
        "N",
        "Knight"
    )
    static Giraffe: TamerlanePieceType = TamerlanePieces.createPiece(
        "F",
        "Giraffe"
    )
    static General: TamerlanePieceType = TamerlanePieces.createPiece(
        "G",
        "General"
    )
    static Vizier: TamerlanePieceType = TamerlanePieces.createPiece(
        "V",
        "Vizier"
    )



    static PawnOfElephant: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.Elephant
    )
    static PawnOfCamel: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.Camel
    )
    static PawnOfDabbaba: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.Dabbaba
    )
    static PawnOfRook: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.Rook
    )
    static PawnOfPicket: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.Picket
    )
    static PawnOfKnight: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.Knight
    )
    static PawnOfGiraffe: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.Giraffe
    )
    static PawnOfGeneral: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.General
    )
    static PawnOfVizier: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.Vizier
    )

    static King: TamerlanePieceType = TamerlanePieces.createRoyal(
        "K",
        "King"
    )
    static Prince: TamerlanePieceType = TamerlanePieces.createRoyal(
        "P",
        "Prince"
    )
    static AdventitiousKing: TamerlanePieceType = TamerlanePieces.createRoyal(
        "A",
        "Adventitious King"
    )

    static PawnOfKing: PawnType = TamerlanePieces.createPawnNamed(
        TamerlanePieces.Prince,
        "k",
        "Pawn of Kings",
    )
    static PawnOfPawns: PawnType = TamerlanePieces.createPawnNamed(
        TamerlanePieces.AdventitiousKing,
        "p",
        "Pawn of Pawns",
    )


    private static createPiece(charRep: string, name: string): TamerlanePieceType {
        let piece = new TamerlanePieceType(charRep, name);
        Object.freeze(piece);
        return piece;
    }
    private static createRoyal(charRep: string, name: string): TamerlanePieceType {
        let piece = new TamerlanePieceType(charRep, name);
        piece.royal = true;
        Object.freeze(piece);
        return piece;
    }
    private static createPawnNamed(promotion: TamerlanePieceType, charRep: string, name: string): PawnType {
        let pawn = new PawnType(
            promotion,
            charRep,
            name,
        )
        Object.freeze(pawn);
        return pawn;
    }
    private static createPawn(promotion: TamerlanePieceType): PawnType {
        let pawn = new PawnType(
            promotion,
            promotion.charRep.toLowerCase(),
            `Pawn of ${promotion.name}s`,
        )
        Object.freeze(pawn);
        return pawn;
    }
}
