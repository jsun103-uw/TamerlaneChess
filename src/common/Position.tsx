import { BOARD_FILES, BOARD_RANKS, BoardPiece } from "./Board";

export abstract class Position {
    abstract readonly kind: "board" | "citadel";
}
export type PositionUnion = CitadelPosition | BoardPosition;
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

export class BoardPosition extends Position {
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

export class Citadel {

    piece: BoardPiece;
    #position: CitadelPosition;
    get position() { return this.#position; }

    constructor(position: CitadelPosition) {
        this.#position = position;
        this.piece = null;
    }
}
