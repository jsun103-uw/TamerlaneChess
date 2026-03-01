import { BOARD_FILES, BOARD_RANKS, BoardPiece } from "./Board";

export abstract class Position {
    abstract readonly kind: "board" | "citadel";
}
export type PositionUnion = CitadelPosition | BoardPosition;
export class CitadelPosition extends Position {
    readonly kind = "citadel" as const;
    public readonly rank: number;

    private constructor(rank: number) {
        super();
        this.rank = rank;
    }

    static getLeft(): CitadelPosition {
        var pos = new CitadelPosition(8); // rank 9, index 8.
        Object.freeze(pos);
        return pos;
    }
    static getRight(): CitadelPosition {
        var pos = new CitadelPosition(1); // rank 2, index 1.
        Object.freeze(pos);
        return pos;
    }

    equals(other: CitadelPosition): boolean {
        return this.rank == other.rank;
    }
}

export class BoardPosition extends Position {
    static valid(file: number, rank: number): boolean {
        return (rank < BOARD_RANKS && rank >= 0) 
            && (file < BOARD_FILES && file >= 0);
    }
    static trymake(file: number, rank: number): BoardPosition | null {
        if (this.valid(file, rank)) {
            return new BoardPosition(file, rank);
        }
        return null;
    }
    readonly kind = "board" as const;
    public readonly rank: number;
    public readonly file: number;


    constructor(file: number, rank: number) {
        super();
        this.file = file;
        this.rank = rank;


        if (rank >= BOARD_RANKS || rank < 0) throw new RangeError(`Rank must be between 0 and ${BOARD_RANKS - 1}, but was ${rank}`)
        if (file >= BOARD_FILES || file < 0) throw new RangeError(`File must be between 0 and ${BOARD_FILES - 1}, but was ${file}`)
    }

    equals(other: BoardPosition): boolean {
        return this.rank === other.rank 
            && this.file === other.file;
    }

    static get fileNames(): string[] {
        return [ "A","B","C","D","E","F","G","H","I","J","K" ]
    }
    rankName(): string {
        return (this.rank + 1).toString();
    }
    fileName(): string {
        return BoardPosition.fileNames[this.file];
    }
    squareName(): string {
        return this.fileName() + this.rankName();
    }

    toString(): string {
        return this.squareName();
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
    toString(): string {
        return `X${this.#position.rank}`;
    }
}
