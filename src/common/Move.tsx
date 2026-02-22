import { BoardPosition } from "./Position";

type Move = TakeMove | ExchangeMove;export class TakeMove {
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

export class ExchangeMove extends TakeMove {
    constructor(start: BoardPosition, end: BoardPosition) {
        super(start, end);
    }
}

