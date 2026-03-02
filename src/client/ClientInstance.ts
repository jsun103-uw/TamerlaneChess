import { convertMoveJson } from "../common/Convert";
import { Game } from "../common/Game";
import { MoveUnion } from "../common/Move";
import { Player } from "../common/Player";
import { BoardPosition } from "../common/Position";
import { BadResponse, MoveRequest, MoveResponse, TamerlaneRequestENUM, TamerlaneResponseENUM, UpdateRequest } from "../common/Request";
import { sendRequest } from "./client";

export class ClientInstance extends EventTarget
{
    public readonly game: Game;

    public readonly side: Player;
    public readonly token: number;

    public readonly instanceNum: number;
    

    constructor(side: Player, token: number, instanceNum: number) {
        super();
        this.game = new Game();
        this.side = side;
        this.token = token;
        this.instanceNum = instanceNum;
    }

    public debugGetBoard(): string {
        return this.game.debugGetBoard();
    }

    public receive(move: MoveUnion) {
        if (!this.game.trymove(move)) 
            console.error(`Client out of sync: Server made illegal move: \n${this.game.debugGetBoard()}\n${move.toString()} `);
    }

    public postMove(move: MoveUnion) {
        const request: MoveRequest = {
            request: TamerlaneRequestENUM.move,
            move: move,
            instance: this.instanceNum,
            token: this.token,
            turnNum: this.game.turnNumber,
        }
        sendRequest(request, (resp) => this.handleMoveResponse(resp));
    }

    /**
     * Asks server for updates, if isn't turn
     */
    public pollUpdate() {
        if (this.game.turn === this.side) return;
        const request: UpdateRequest = {
            request: TamerlaneRequestENUM.update,
            instance: this.instanceNum,
            token: this.token,
            turnNum: this.game.turnNumber,
        }
        sendRequest(request, (resp) => this.handleMoveResponse(resp));
    }

    public getMovesFor(pos: BoardPosition) {
        return this.game.getMovesFor(pos);
    }


    private handleMoveResponse(data: MoveResponse | BadResponse) {
        if (data.response === TamerlaneResponseENUM.bad) {
            console.error(data.message);
        }
        else if (data.response === TamerlaneResponseENUM.move) {
            if (data.move === undefined) {
                console.error(`No move found: `, data);
                return;
            }

            const move = convertMoveJson(data.move);
            if (move === null) {
                
                console.error(`Failed to parse move: `, data.move);
                return;
            }
            if (this.game.trymove(move)) {
                this.dispatchEvent(new ClientInstanceEvent(ClientInstanceEventENUM.update, this));
            }
            else {
                console.error(`Failed to execute move ${move}`);
            }
        }
        else {
            console.error(`Unknown response ${JSON.stringify(data)}`);
        }
    }
}

export class ClientInstanceEvent extends Event{
    public readonly instance: ClientInstance
    constructor(event: ClientInstanceEventENUM, instance: ClientInstance) {
        super(event);
        this.instance = instance;
    }
}
export enum ClientInstanceEventENUM {
    update = "update",
}