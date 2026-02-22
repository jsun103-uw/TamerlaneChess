

// [File][Rank]

export type PositionUnion = CitadelPosition | BoardPosition;
abstract class Position {
    abstract readonly kind: "board" | "citadel";
}
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

    piece: PieceTypeNullable;
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
    #field: PieceType[][];
    #citadelLeft: Citadel;
    #citadelRight: Citadel;

    getPiece(position: PositionUnion): PieceTypeNullable {
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
        this.#field = new Array<PieceType[]>(BOARD_FILES);
        for (let i = 0; i < BOARD_FILES; i ++) {
            this.#field[i] = new Array<PieceType>(BOARD_RANKS)
        }
        this.#citadelLeft = new Citadel(CitadelPosition.getLeft())
        this.#citadelRight = new Citadel(CitadelPosition.getRight())
    }

    static buildStartingBoard(): Board {
        let board = new Board();
        board.#field[0][0] = new PieceType();
        return board;
    }

    debugGet(): string {
        let boardstr: string = "";
        for (let rank = BOARD_RANKS - 1; rank >= 0; rank --) {
            let items: string = "";
            // citadel space
            if (rank === this.#citadelLeft.position.rank) {
                items += this.#citadelLeft.piece === null 
                    ? "." : this.#citadelLeft.piece.oneCharRep;
            }
            else items += "█";

            // board
            for (let file = 0; file < BOARD_FILES; file ++) {
                let piece = this.getPiece(new BoardPosition(file, rank));
                items += (piece == null) 
                    ? "." : piece.oneCharRep();
            }

            // citadel space

            if (rank === this.#citadelRight.position.rank) {
                items += this.#citadelRight.piece === null 
                    ? "." : this.#citadelRight.piece.oneCharRep;
            }
            else items += "█";
            boardstr += items + "\n";
            // console.log(`R${rank}`)
        }
        return boardstr;
    }

    
}

/**
 * An interface that describes a tamerlane piece.
 */
interface TamerlanePiece {
    oneCharRep(): string;
    get position(): BoardPosition;
}

type BoardTamerlanePieceNullable = BoardTamerlanePiece | null;
class BoardTamerlanePiece implements TamerlanePiece {
    #position: BoardPosition;

    get position(): BoardPosition {
        return this.#position;
    }
    set position(value: BoardPosition) {
        this.#position = value;
    }

    constructor(position: BoardPosition) {
        this.#position = position;
    }

    oneCharRep(): string {
        return "P";
    }
}

type PieceTypeNullable = PieceType | null;
class PieceType {
    oneCharRep(): string {
        return "P";
    }
}
