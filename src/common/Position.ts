import { BoardPiece } from "./Board.js";
import { BOARD_FILES, BOARD_RANKS } from "./Consts.js";

export abstract class Position {
    public abstract readonly kind: "board" | "citadel";
}
export type PositionUnion = CitadelPosition | BoardPosition;
export class CitadelPosition extends Position {
    /**
     * Tries to get the citadel position associated with the rank
     * @param rank 
     */
    public static tryGet(rank: number): CitadelPosition | null {
        if (rank === 8) return this.getLeft();
        else if (rank === 1) return this.getRight();
        return null;
    }

    public readonly kind = "citadel" as const;
    public readonly rank: number;
    /**
     * The file index supposing the board files stretched to its location.
     */
    public readonly file: number;

    private constructor(rank: number, file: number) {
        super();
        this.rank = rank;
        this.file = file;
    }

    public static getLeft(): CitadelPosition {
        var pos = new CitadelPosition(8, -1); // rank 9, index 8.
        Object.freeze(pos);
        return pos;
    }
    public static getRight(): CitadelPosition {
        var pos = new CitadelPosition(1, BOARD_FILES); // rank 2, index 1.
        Object.freeze(pos);
        return pos;
    }

    public equals(other: CitadelPosition): boolean {
        return this.rank == other.rank;
    }
}

export class BoardPosition extends Position {
    public static valid(file: number, rank: number): boolean {
        return (rank < BOARD_RANKS && rank >= 0) 
            && (file < BOARD_FILES && file >= 0);
    }
    public static trymake(file: number, rank: number): BoardPosition | null {
        if (this.valid(file, rank)) {
            return new BoardPosition(file, rank);
        }
        return null;
    }
    

    public static readonly allPositions: ReadonlyArray<BoardPosition> = (
        () => {
            const arr = [];
            for (let file = 0; file < BOARD_FILES; file ++) {
                for (let rank = 0; rank < BOARD_RANKS; rank ++) {
                    arr.push(new BoardPosition(file, rank));
                }
            }
            return arr;
        }
    )();

    public readonly kind = "board" as const;
    public readonly rank: number;
    public readonly file: number;


    public constructor(file: number, rank: number) {
        super();
        this.file = file;
        this.rank = rank;


        if (rank >= BOARD_RANKS || rank < 0) throw new RangeError(`Rank must be between 0 and ${BOARD_RANKS - 1}, but was ${rank}`)
        if (file >= BOARD_FILES || file < 0) throw new RangeError(`File must be between 0 and ${BOARD_FILES - 1}, but was ${file}`)
    }

    public equals(other: BoardPosition): boolean {
        return this.rank === other.rank 
            && this.file === other.file;
    }

    public static get fileNames(): string[] {
        return [ "A","B","C","D","E","F","G","H","I","J","K" ]
    }
    public rankName(): string {
        return (this.rank + 1).toString();
    }
    public fileName(): string {
        return BoardPosition.fileNames[this.file];
    }
    public squareName(): string {
        return this.fileName() + this.rankName();
    }

    public toString(): string {
        return this.squareName();
    }
}

export class Citadel {
    public piece: BoardPiece;
    #position: CitadelPosition;
    public get position() { return this.#position; }

    public constructor(position: CitadelPosition) {
        this.#position = position;
        this.piece = null;
    }
    public toString(): string {
        return `X${this.#position.rank}`;
    }
}
