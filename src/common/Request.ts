import { MoveUnion } from "./Move";
import { Player } from "./Player";

export type TamerlaneRequest = typeof TamerlaneRequestENUM.move |
                                typeof TamerlaneRequestENUM.serverlist |
                                typeof TamerlaneRequestENUM.join |
                                typeof TamerlaneRequestENUM.make |
                                typeof TamerlaneRequestENUM.rematch;
export const TamerlaneRequestENUM = {
    move: "move",
    
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
}
export interface MakeRequest {
    readonly request: typeof TamerlaneRequestENUM.make;
}
export interface RematchRequest {
    readonly request: typeof TamerlaneRequestENUM.rematch;
}
export interface MoveRequest {
    readonly request: typeof TamerlaneRequestENUM.move;
}

export type TamerlaneResponse = typeof TamerlaneRequestENUM.move;
export const TamerlaneResponseENUM = {
    move: "move",
    serverlist: "serverlist",
    join: "join",

    bad: "badResponse"
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