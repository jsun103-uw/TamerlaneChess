import { BoardPosition } from "./Position";
export abstract class Move {
    abstract readonly kind: "take" | "exchange";
}
export type MoveUnion = TakeMove | ExchangeMove;
abstract class BoardMove extends Move {
    
    #start: BoardPosition;
    #end: BoardPosition;


    get start(): BoardPosition {
        return this.#start;
    }
    get end(): BoardPosition {
        return this.#end;
    }


    constructor(start: BoardPosition, end: BoardPosition) {
        super();
        this.#start = start;
        this.#end = end;
    }

    toString(): string {
        return `${this.start} to ${this.end}`;
    }
}
export class TakeMove extends BoardMove {
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

