import { randomInt } from "node:crypto";
import { Game } from "../common/Game";
import { MoveUnion } from "../common/Move";
import { Player, PlayerENUM } from "../common/Player";

const tokenRange: number = 2**48 - 1;
export class GameInstance {
    public readonly game: Game = new Game();

    public readonly whiteToken: number;
    public readonly blackToken: number;
    public tokenOf(player: Player): number {
        if (player === PlayerENUM.White) return this.whiteToken;
        else return this.blackToken;
    }
    getFreeSide(): Player | null {
        if (this.joinedWhite && this.joinedBlack) return null;
        if (this.joinedWhite) return PlayerENUM.Black;
        return PlayerENUM.White;
    }

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
        this.join(PlayerENUM.White);

        // 
        if (this.game.turn === PlayerENUM.White && this.whiteToken === token) {
            if (this.game.trymove(move)) return move;
        }
        else if (this.game.turn === PlayerENUM.Black && this.blackToken === token) {
            if (this.game.trymove(move)) return move;
        }
    }
    public join(side: Player): boolean {
        if (side === PlayerENUM.White && !this.#joinedWhite) {
            this.#joinedWhite = true;
            return true;
        }
        else if (side === PlayerENUM.Black && !this.#joinedBlack) {
            this.#joinedBlack = true;
            return true;
        }
        return false;
    }
}

