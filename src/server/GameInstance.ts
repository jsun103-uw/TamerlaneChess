import { randomInt } from "node:crypto";
import { Game } from "../common/Game.js";
import { MoveUnion } from "../common/Move.js";
import { Player, PlayerENUM } from "../common/Player.js";

/**
 * Maximum token number
 */
const tokenRange: number = 2**48 - 1;
/**
 * A server's representation of a game
 */
export class GameInstance {
    public readonly game: Game = new Game();

    public readonly name: string;

    // Tokens represent a player's identification. Players use token to authenticate themselves to the game instance, hidden via https
    public readonly whiteToken: number;
    public readonly blackToken: number;
    /**
     * @returns the token of the player side
     */
    public tokenOf(player: Player): number {
        if (player === PlayerENUM.White) return this.whiteToken;
        else return this.blackToken;
    }
    /**
     * @returns The side that has yet to join, or null if full
     */
    public getFreeSide(): Player | null {
        if (this.joinedWhite && this.joinedBlack) return null;
        if (this.joinedWhite) return PlayerENUM.Black;
        return PlayerENUM.White;
    }

    // Flags to check if a player has joined
    #joinedWhite: boolean = false;
    get joinedWhite() { return this.#joinedWhite; }
    #joinedBlack: boolean = false;
    get joinedBlack() { return this.#joinedBlack; }
    /**
     * True if a player has joined
     */
    get full() { return this.#joinedBlack && this.joinedWhite; }
    

    #lastAccessed: number = Date.now();
    /**
     * The last time a client pinged this instnace
     */
    get lastAccessed(): number { return this.#lastAccessed; }

    #lastMove: MoveUnion | null = null;


    constructor(name: string) {
        this.name = name;

        this.whiteToken = randomInt(tokenRange);
        let black: number;
        do {
            black = randomInt(tokenRange);
        } while(black === this.whiteToken)
        this.blackToken = black;
    }
    /**
     * @returns the side of the player if token matches a player. Null if invalid token
     */
    public sideOf(token: number): Player | null {
        if (this.whiteToken === token) return PlayerENUM.White;
        else if (this.blackToken === token) return PlayerENUM.Black;
        return null;

    }

    public do(token: number, move: MoveUnion) {
        this.join(PlayerENUM.White);
        // console.log(`entering ${move} for ${token}`)

        if ((this.game.turn === PlayerENUM.White && this.whiteToken === token)
            || (this.game.turn === PlayerENUM.Black && this.blackToken === token)
        ) {
            // log access
            this.#lastAccessed = Date.now();

            console.log(`doing ${move} for ${token}`)
            if (this.game.trymove(move)) {
                this.#lastMove = move;
                return move;
            }
        }
        return null;
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


    /**
     * Returns the last move if the request is recent
     */
    public getUpdateFor(token: number, turnNum: number): MoveUnion | null {
        const side = this.sideOf(token);
        if (side === null) return null;

        // log access, keeps the game alive if a player is thinking for a long time
        this.#lastAccessed = Date.now();


        // game hasn't started
        if (this.#lastMove === null) return null;

        //* If the requester is white, the turn is white (black finished), and their turn is one less than the current.
        //* or if the reques is black, the turn is black (white finished), and their turn is the same as the current.
        if ((
                side === PlayerENUM.White 
                && this.game.turn === PlayerENUM.White 
                && this.game.turnNumber === turnNum + 1
            ) || (
                side === PlayerENUM.Black 
                && this.game.turn === PlayerENUM.Black 
                && this.game.turnNumber === turnNum
            )
        ) return this.#lastMove;


        return null;
    }
}

