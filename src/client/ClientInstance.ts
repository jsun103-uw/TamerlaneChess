import { PositionedTamerlanePiece } from "../common/Board";
import { convertMoveJson } from "../common/Convert";
import { Game } from "../common/Game";
import { MoveUnion } from "../common/Move";
import { Player, PlayerENUM } from "../common/Player";
import { BoardPosition, PositionUnion } from "../common/Position";
import { BadResponse, MoveRequest, MoveResponse, NoResponse, TamerlaneRequestENUM, TamerlaneResponseENUM, UpdateRequest } from "../common/Request";
import { TamerlanePieceType } from "../common/TamerlanePieces";
import { sendRequest } from "./Client";

export class ClientInstance
{
    public readonly opponentName: string;
    public readonly displayName: string;

    public readonly game: Game;

    public readonly side: Player;
    public readonly token: number;

    public readonly instanceNum: number;

    #victory: boolean | null = null;
    public isGameEnded(): boolean { return this.#victory !== null; }
    public isWon(): boolean {
        return this.#victory !== null && this.#victory;
    }
    public isLost(): boolean {
        return this.#victory !== null && !this.#victory;
    }
    

    constructor(side: Player, token: number, instanceNum: number, 
        displayName: string, opponentName: string, 
    ) {
        this.game = new Game();
        this.side = side;
        this.token = token;
        this.instanceNum = instanceNum;

        this.displayName = displayName;
        this.opponentName = opponentName;
    }

    /**
     * True if is this client's turn
     */
    public isTurn(): boolean {
        return this.side === this.game.turn;
    }
    public isChecked(): boolean {
        return this.game.checked;
    }

    /**
     * @returns pieces this client captured
     */
    public getCaptured(): Iterable<TamerlanePieceType> {
        if (this.side === PlayerENUM.White) return this.game.getBlackTaken();
        else return this.game.getWhiteTaken();
    }
    /**
     * @returns pieces the opponent of this client captured
     */
    public getLosses(): Iterable<TamerlanePieceType> {
        if (this.side === PlayerENUM.White) return this.game.getWhiteTaken();
        else return this.game.getBlackTaken();
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
    public async pollUpdate(onSucceed: () => (void)): Promise<void> {
        if (this.game.turn === this.side) return;
        const request: UpdateRequest = {
            request: TamerlaneRequestENUM.update,
            instance: this.instanceNum,
            token: this.token,
            turnNum: this.game.turnNumber,
        }
        return sendRequest(request, (resp) => this.handleMoveResponse(resp, onSucceed));
    }

    public getMovesFor(pos: PositionUnion): Generator<MoveUnion> {
        return this.game.getMovesFor(pos, this.side);
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
                if (this.game.checkmated) {
                    if (this.isTurn()) {
                        this.#victory = false;
                    }
                    else this.#victory = true;
                }
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