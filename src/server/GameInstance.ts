import { randomInt } from "node:crypto";
import { Game } from "../common/Game";
import { MoveUnion } from "../common/Move";
import { PlayerENUM } from "../common/Player";

const tokenRange: number = 2**48 - 1;
export class GameInstance {
    public readonly game: Game = new Game();

    public readonly whiteToken: number;
    public readonly blackToken: number;

    #joinedWhite: boolean = false;
    get joinedWhite() { return this.#joinedWhite; }
    #joinedBlack: boolean = false;
    get joinedBlack() { return this.#joinedBlack; }
    get full() { return this.#joinedBlack && this.joinedWhite; }
    

    #lastAccessed: number = Date.now();
    get lastAccessed(): number { return this.lastAccessed; }

    constructor() {
        this.whiteToken = randomInt(tokenRange);
        let black: number;
        do {
            black = randomInt(tokenRange);
        } while(black === this.whiteToken)
        this.blackToken = black;
    }

    public do(token: number, move: MoveUnion) {
        // update metadata
        this.#lastAccessed = Date.now();
        this.join(token);

        // 
        if (this.game.turn === PlayerENUM.White && this.whiteToken === token) {
            if (this.game.trymove(move)) return move;
        }
        else if (this.game.turn === PlayerENUM.Black && this.blackToken === token) {
            if (this.game.trymove(move)) return move;
        }
    }
    public join(token: number) {
        if (this.whiteToken === token) {
            this.#joinedWhite = true;
        }
        else if (this.blackToken === token) {
            this.#joinedBlack = true;
        }
    }
}

