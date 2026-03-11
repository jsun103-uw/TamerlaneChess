import { MoveUnion } from "./Move.js";
import { Player } from "./Player.js";

export type TamerlaneRequest = typeof TamerlaneRequestENUM.move |
                                typeof TamerlaneRequestENUM.update |
                                typeof TamerlaneRequestENUM.serverlist |
                                typeof TamerlaneRequestENUM.join |
                                typeof TamerlaneRequestENUM.make |
                                typeof TamerlaneRequestENUM.rematch;
export const TamerlaneRequestENUM = {
    move: "move",
    update: "update",
    
    serverlist: "getserver",
    join: "join",
    make: "make",
    rematch: "rematch",
} as const;

export interface GetServersRequest {
    readonly request: typeof TamerlaneRequestENUM.serverlist;
}

export interface ConnectRequest {
    readonly request: typeof TamerlaneRequestENUM.join;
    readonly instance: number;
}
export interface MakeRequest {
    readonly request: typeof TamerlaneRequestENUM.make;
}
export interface RematchRequest {
    readonly request: typeof TamerlaneRequestENUM.rematch;
}
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

export type TamerlaneResponse = typeof TamerlaneRequestENUM.move;
export const TamerlaneResponseENUM = {
    move: "move",
    serverlist: "serverlist",
    join: "join",

    bad: "badResponse",
    none: "none",
} as const;

export interface BadResponse {
    readonly response: typeof TamerlaneResponseENUM.bad;
    readonly message: string;
}
export interface ServerlistResponse {
    readonly response: typeof TamerlaneResponseENUM.serverlist;
    readonly servers: ServerInfo[];
}
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
export interface ServerInfo {
    readonly instanceNumber: number;
    /**
     * The side that the joining player will be taking. All games should have at least one player
     */
    readonly playerSide: Player;

}

export interface MoveResponse {
    readonly response: typeof TamerlaneResponseENUM.move;
    readonly move: MoveUnion;
}
export interface NoResponse {
    readonly response: typeof TamerlaneResponseENUM.none;
}