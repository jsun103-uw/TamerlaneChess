import { BoardPosition } from "./Position.js";
export abstract class Move {
    abstract readonly kind: typeof MoveENUM.take | typeof MoveENUM.exchange;
}
export const MoveENUM = {
    take: "take",
    exchange: "exchange",
} as const;

export type MoveUnion = TakeMove | ExchangeMove;
abstract class BoardMove extends Move {
    
    public readonly start: BoardPosition;
    public readonly end: BoardPosition;




    constructor(start: BoardPosition, end: BoardPosition) {
        super();
        this.start = start;
        this.end = end;
    }

    toString(): string {
        return `${this.start} to ${this.end}`;
    }
}
export class TakeMove extends BoardMove {
    static tryMake(f1: number, r1: number, f2: number, r2: number, ): TakeMove | null {
        const start = BoardPosition.trymake(f1, r1);
        const end = BoardPosition.trymake(f2, r2);
        if (start !== null && end !== null) return new TakeMove(start, end);
        return null;
    }



    readonly kind = "take" as const;


    constructor(start: BoardPosition, end: BoardPosition) {
        super(start, end);
    }
    toString(): string {
        return `${this.start} to ${this.end}`;
    }
}

export class ExchangeMove extends BoardMove {
    readonly kind = "exchange" as const;

    constructor(start: BoardPosition, end: BoardPosition) {
        super(start, end);
    }
    toString(): string {
        return `exchange ${this.start} with ${this.end}`;
    }
}

