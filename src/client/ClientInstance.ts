import { PositionedTamerlanePiece } from "../common/Board";
import { convertMoveJson } from "../common/Convert";
import { Game } from "../common/Game";
import { MoveUnion } from "../common/Move";
import { Player } from "../common/Player";
import { BoardPosition, PositionUnion } from "../common/Position";
import { BadResponse, MoveRequest, MoveResponse, NoResponse, TamerlaneRequestENUM, TamerlaneResponseENUM, UpdateRequest } from "../common/Request";
import { sendRequest } from "./client";

export class ClientInstance
{
    public readonly game: Game;

    public readonly side: Player;
    public readonly token: number;

    public readonly instanceNum: number;
    

    constructor(side: Player, token: number, instanceNum: number) {
        this.game = new Game();
        this.side = side;
        this.token = token;
        this.instanceNum = instanceNum;
    }

    public debugGetBoard(): string {
        return this.game.debugGetBoard();
    }
    public getPieces(): Generator<PositionedTamerlanePiece> {
        return this.game.getPieces();
    }

    public receive(move: MoveUnion) {
        if (!this.game.trymove(move)) 
            console.error(`Client out of sync: Server made illegal move: \n${this.game.debugGetBoard()}\n${move.toString()} `);
    }

    public postMove(move: MoveUnion, onSucceed: () => (void)) {
        const request: MoveRequest = {
            request: TamerlaneRequestENUM.move,
            move: move,
            instance: this.instanceNum,
            token: this.token,
            turnNum: this.game.turnNumber,
        }
        sendRequest(request, (resp) => this.handleMoveResponse(resp, onSucceed));
    }

    /**
     * Asks server for updates, if waiting for opponent's move
     */
    public pollUpdate(onSucceed: () => (void)) {
        if (this.game.turn === this.side) return;
        const request: UpdateRequest = {
            request: TamerlaneRequestENUM.update,
            instance: this.instanceNum,
            token: this.token,
            turnNum: this.game.turnNumber,
        }
        sendRequest(request, (resp) => this.handleMoveResponse(resp, onSucceed));
    }

    public getMovesFor(pos: PositionUnion): Generator<MoveUnion> {
        return this.game.getMovesFor(pos);
    }


    private handleMoveResponse(data: MoveResponse | BadResponse | NoResponse, onSucceed: () => (void)) {
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
            }
            else if (this.game.trymove(move)) {
                // this.dispatchEvent(new ClientInstanceEvent(ClientInstanceEventENUM.update, this));
                onSucceed();
                return;
            }
            else {
                console.error(`Failed to execute move ${move}`);
            }
        }
        else if (data.response === TamerlaneResponseENUM.none) {
        }
        else {
            console.error(`Unknown response ${JSON.stringify(data)}`);
        }
        return; 
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