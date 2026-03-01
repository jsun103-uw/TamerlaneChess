import { Game } from "../common/Game";
import { MoveUnion } from "../common/Move";
import { Player } from "../common/Player";
import { BoardPosition } from "../common/Position";
import { MoveRequest, TamerlaneRequestENUM } from "../common/Request";
import { sendRequest } from "./client";

export class ClientInstance
{
    public readonly game: Game = new Game();

    public readonly side: Player;
    public readonly token: number;
    

    constructor(side: Player, token: number) {
        this.side = side;
        this.token = token;
    }

    public receive(move: MoveUnion) {
        if (!this.game.trymove(move)) 
            console.error(`Client out of sync: Server made illegal move: \n${this.game.debugGetBoard()}\n${move.toString()} `);
    }

    public postMove(move: MoveUnion) {
        const request: MoveRequest = {
            request: TamerlaneRequestENUM.move,
            move: move,
        }
        sendRequest(request, json => {
            console.log(json);
        });
    }
    getMovesFor(pos: BoardPosition) {
        return this.game.getMovesFor(pos);
    }
}