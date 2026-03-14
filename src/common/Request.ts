import { MoveUnion } from "./Move.js";
import { Player } from "./Player.js";

/**
 * Discriminated union for possible request strings
 */
export type TamerlaneRequest = typeof TamerlaneRequestENUM.move |
                                typeof TamerlaneRequestENUM.update |
                                typeof TamerlaneRequestENUM.serverlist |
                                typeof TamerlaneRequestENUM.join |
                                typeof TamerlaneRequestENUM.make |
                                typeof TamerlaneRequestENUM.rematch |
                                typeof TamerlaneRequestENUM.gameexit;
export const TamerlaneRequestENUM = {
    move: "move",
    update: "update",
    
    serverlist: "getserver",
    join: "join",
    make: "make",
    rematch: "rematch",
    gameexit: "gameexit",
} as const;

/**
 * A notification that the player is exiting the game (will clean up_)
 */
export interface GameExitRequest {
    readonly request: typeof TamerlaneRequestENUM.gameexit;
    readonly instance: number;
    readonly token: number;
}
/**
 * A request to get all the joinable servers
 */
export interface GetServersRequest {
    readonly request: typeof TamerlaneRequestENUM.serverlist;
}

/**
 * A request to connect to a server instance
 */
export interface ConnectRequest {
    readonly request: typeof TamerlaneRequestENUM.join;
    readonly instance: number;
}
/**
 * A request to make a new server
 */
export interface MakeRequest {
    readonly request: typeof TamerlaneRequestENUM.make;
    readonly name: string;
}
/**
 * Not implemented
 */
export interface RematchRequest {
    readonly request: typeof TamerlaneRequestENUM.rematch;
    readonly instance: number;
    readonly token: number;
}
/**
 * A reques to make a move by a client
 */
export interface MoveRequest {
    readonly request: typeof TamerlaneRequestENUM.move;
    readonly move: MoveUnion;
    readonly instance: number;
    readonly token: number;
    readonly turnNum: number;
}
/**
 * A reques to check if the other player has made a move yet
 */
export interface UpdateRequest {
    readonly request: typeof TamerlaneRequestENUM.update;
    readonly instance: number;
    readonly token: number;
    readonly turnNum: number;
}

/**
 * Discriminated union for possible response strings
 */
export type TamerlaneResponse = typeof TamerlaneRequestENUM.move;
export const TamerlaneResponseENUM = {
    move: "move",
    serverlist: "serverlist",
    join: "join",

    bad: "badResponse",
    none: "none",
} as const;

/**
 * A resposne indicating that the request could not be fulfilled due to some reason
 */
export interface BadResponse {
    readonly response: typeof TamerlaneResponseENUM.bad;
    readonly message: string;
}
/**
 * A resposne indicating the joinable game instances
 */
export interface ServerlistResponse {
    readonly response: typeof TamerlaneResponseENUM.serverlist;
    readonly servers: ServerInfo[];
}
/**
 * A resposne indicating that the player has joined a game instance
 */
export interface JoinResponse {
    readonly response: typeof TamerlaneResponseENUM.join;
    readonly player: Player;
    /**
     * Token to identify user
     */
    readonly token: number;
    /**
     * Server instance
     */
    readonly instance: number;
}
/**
 * A json structure for data about an active game instance
 */
export interface ServerInfo {
    /**
     * Cosmetic display name of the server
     */
    readonly name: string;

    readonly instanceNumber: number;
    /**
     * The side that the joining player will be taking. All games should have at least one player
     */
    readonly playerSide: Player;

}

/**
 * A resposne indicating that a move has been emitted since they last checked
 */
export interface MoveResponse {
    readonly response: typeof TamerlaneResponseENUM.move;
    readonly move: MoveUnion;
}
/**
 * A resposne that indicates nothing has happened or has been returned
 */
export interface NoResponse {
    readonly response: typeof TamerlaneResponseENUM.none;
}