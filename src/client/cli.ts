import * as readline from "readline";
import { requestJoin, requestMake, requestServers } from "./client";
import { ClientInstance, ClientInstanceEvent, ClientInstanceEventENUM } from "./ClientInstance";
import { MoveUnion } from "../common/Move";
import { PlayerENUM } from "../common/Player";
import { BoardPosition } from "../common/Position";
import { printMoves } from "../common/Utility";
import { TamerlaneResponseENUM } from "../common/Request";




const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

const moveReg = /^s*(\d+)s*$/;
const pieceReg = /^s*([a-zA-Z])(\d+)s*$/;

let client: ClientInstance | null = null;
// function makeMove(move: MoveUnion) {

// }
let moves: MoveUnion[] = [];

let polling;


const joinReg = /^\s*join\s*(\d+)\s*$/;
rl.on("line", (input: string) => {
    let matches: RegExpExecArray | null;


    matches = joinReg.exec(input);
    if (matches !== null) {
        requestJoin(parseInt(matches[1]), resp => { handleJoinReponse(resp); } );
        return;
    }
    if (/^\s*list\s*$/.test(input)) {
        requestServers((resp) => console.log(resp.servers));
        return;
    }
    if (/^\s*new\s*$/.test(input)) {
        requestMake(resp => { handleJoinReponse(resp); });
        return;
    }

    if (client === null) return;
    //* playing active game

    matches = moveReg.exec(input);
    if (matches !== null) {
        let moveidx: number = parseInt(matches[1]);
        if (moveidx >= 0 && moveidx < moves.length ) {

            console.log(`selecting move ${moveidx}: ${moves[moveidx]}`);
            client?.postMove(moves[moveidx]);
            return;
        }
        else console.log(`Failed to find move index ${moveidx}`);
    }
    matches = pieceReg.exec(input);
    if (matches !== null) {
        if (matches !== null) {
            let pos: BoardPosition | null = BoardPosition.trymake(matches[1].toUpperCase().charCodeAt(0) - 65, parseInt(matches[2]) - 1);
            if (pos !== null) 
            {
                moves = [...client.getMovesFor(pos)];
                printMoves(moves);
            }
            else console.log(`Position does not exist`);
        }
    }
});

rl.on("close", () => {
  process.exit(0);
});



function handleJoinReponse(resp: any) {
    if (resp.response === TamerlaneResponseENUM.bad) {
        console.log(`Failed: ${resp.message}`);
    }
    else {
        console.log(`Joined game instance ${resp.instance} as ${resp.player}`);
        client = new ClientInstance(resp.player, resp.token, resp.instance);
        client.addEventListener(ClientInstanceEventENUM.update, ((e: ClientInstanceEvent) => {
            console.log(e.instance.debugGetBoard());
        }) as EventListener);
        polling = setInterval(() => { client?.pollUpdate(); }, 600)
    }
}