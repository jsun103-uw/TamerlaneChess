import { ExchangeMove, MoveENUM, MoveUnion, TakeMove } from "./Move";
import { BoardPosition, Citadel, CitadelPosition, PositionUnion } from "./Position";

export function convertMoveJson(json: any): MoveUnion | null {
    if (json.kind === MoveENUM.take || json.kind === MoveENUM.exchange) {
        const start: PositionUnion | null = convertPositionJson(json.start);
        const end: PositionUnion | null = convertPositionJson(json.end);
        if (start === null || end === null
            || start.kind !== "board" || end.kind !== "board"
        ) return null;
        
        if (json.kind === MoveENUM.take) return new TakeMove(start, end);
        if (json.kind === MoveENUM.exchange) return new ExchangeMove(start, end);
    }
    return null;
}

export function convertPositionJson(json: any): PositionUnion | null {
    if (json.kind === "board") {
        const file = parseInt(json.file);
        const rank = parseInt(json.rank);
        if (isNaN(rank) || isNaN(file)) return null;

        const result = BoardPosition.trymake(json.file, json.rank);
        if (result !== null) return result;
    }
    else if (json.kind === "citadel") {
        const rank = parseInt(json.rank);
        if (isNaN(rank)) return null;

        const result = CitadelPosition.tryGet(json.rank);
        if (result !== null) return result;
    }
    return null;
}