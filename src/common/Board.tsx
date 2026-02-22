

// [File][Rank]

class Position {
    #rank: number;
    #file: number;

    get rank(): number {
        return this.#rank;
    }
    get file(): number {
        return this.#file;
    }

    get isCitadel(): boolean {
        return (this.rank === BOARD_RANKS - 2 && this.file === -1)
            || (this.rank === 1 && this.file === BOARD_FILES);
    }

    constructor(rank: number, file: number) {
        this.#rank = rank;
        this.#file = file;

        if (rank >= BOARD_RANKS || rank <  0) throw new RangeError(`Rank must be between 0 and ${BOARD_RANKS - 1}`)
        if ((file >=  BOARD_FILES || file < 0) && !this.isCitadel) {
            throw new RangeError(`File must be between 0 and ${BOARD_FILES - 1} or in a citadel position`)
        }

    }

    equals(other: Position): boolean {
        return this.rank === other.rank 
            && this.file === other.file;
    }

    static get rankNames(): string[] {
        return [ "A","B","C","D","E","F","G","H","I","J" ]
    }
    rankName(): string {
        return Position.rankNames[this.rank];
    }
    fileName(): string {
        return (this.file + 1).toString();
    }
    squareName(): string {
        return this.rankName() + this.fileName();
    }
}


class TakeMove {
    #start: Position;
    #end: Position;


    get start(): Position {
        return this.#start;
    }
    get end(): Position {
        return this.#end;
    }

    
    constructor(start: Position, end: Position) {
        this.#start = start;
        this.#end = end;
    }
}
class ExchangeMove extends TakeMove {
    constructor(start: Position, end: Position) {
        super(start, end);
    }
}


class Citadel {

    piece: (BoardTamerlanePiece | null);
    #position: Position;

    constructor(piece: (BoardTamerlanePiece | null), position: Position) {
        this.piece = piece;
        if (position.isCitadel) this.#position = position;
        else throw new RangeError(`Citadel may only appear on ranks ${Citadel.citadelPosition1.rank} and ${Citadel.citadelPosition1.rank}`);
    }
}

const BOARD_FILES = 11;
const BOARD_RANKS = 10;
export class Board {
    #field: (BoardTamerlanePiece | null)[][];
    #citadel1: Citadel;
    #citadel2: Citadel;

    getPiece(position: Position): (TamerlanePiece | null) {
        if (position.isCitadel) {
            if (position.file < 0) return this.#citadel1.piece;
            else return this.#citadel2.piece;
        }
        return null;
    }


    constructor() {
        this.#field = new Array<(BoardTamerlanePiece | null)[]>(BOARD_FILES);
        for (let i = 0; i < BOARD_FILES; i ++) {
            this.#field[i] = new Array<BoardTamerlanePiece | null>(BOARD_RANKS)
        }
        this.#citadel1 = new Citadel(null, BOARD_RANKS - 2);
        this.#citadel2 = new Citadel(null, 1);
    }

    debugGet() {
        for (let rank = BOARD_RANKS; rank > 0; --rank) {
            let items: string = "";
            if (rank == this.#citadel1.#position.rank) {
                if (this.#citadel1.piece === null) items += " ";
                else items += this.#citadel1.piece.oneCharRep;
            }
            else items += "█";
            for (let file = -1; file <= BOARD_FILES; file ++) {
                let piece = this.getPiece(new Position(rank, file));
                if (piece == null) items += "█";
                else items += piece.oneCharRep();
            }
            console.log(`R${rank}`)
        }
    }

    
}

/**
 * An interface that describes a tamerlane piece.
 */
interface TamerlanePiece {
    oneCharRep(): string;
    get position(): Position;
}

class BoardTamerlanePiece implements TamerlanePiece {
    #position: Position;

    get position(): Position {
        return this.#position;
    }
    set position(value: Position) {
        this.#position = value;
    }

    constructor(position: Position) {
        this.#position = position;
    }

    oneCharRep(): string {
        return "P";
    }
}

class PieceType {

}
