import { BoardPiece } from "./Board.js";
import { BOARD_FILES, BOARD_RANKS } from "./Consts.js";

export abstract class Position {
    public abstract readonly kind: "board" | "citadel";
}
export type PositionUnion = CitadelPosition | BoardPosition;

/**
 * Position of the two protruding spaces
 */
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
     * The file index, supposing the board files stretched to its location.
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

    /**
     * True if the rank matches
     */
    public equals(other: CitadelPosition): boolean {
        return this.rank == other.rank;
    }
}

/**
 * Position of any position on the main board
 */
export class BoardPosition extends Position {
    /**
     * Returns true if the file and rank are valid values
     */
    public static valid(file: number, rank: number): boolean {
        return (rank < BOARD_RANKS && rank >= 0) 
            && (file < BOARD_FILES && file >= 0);
    }
    /**
     * Returns the position made from the file and rank, or null if invalid
     */
    public static trymake(file: number, rank: number): BoardPosition | null {
        if (this.valid(file, rank)) {
            return new BoardPosition(file, rank);
        }
        return null;
    }
    
    /**
     * A list of all possible board positions
     */
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

    /**
     * True if the rank and file match
     */
    public equals(other: BoardPosition): boolean {
        return this.rank === other.rank 
            && this.file === other.file;
    }

    private static get fileNames(): string[] {
        return [ "A","B","C","D","E","F","G","H","I","J","K" ]
    }
    /**
     * @returns the rank of this position, as a letter
     */
    public rankName(): string {
        return (this.rank + 1).toString();
    }
    /**
     * @returns the file of this position
     */
    public fileName(): string {
        return BoardPosition.fileNames[this.file];
    }
    /**
     * @returns the algebraic notation for this position, in the form of File-Rank
     */
    public squareName(): string {
        return this.fileName() + this.rankName();
    }

    /**
     * @returns The algebraic notation of this position
     */
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
