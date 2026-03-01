import * as readline from "readline";
import { requestMake, requestServers } from "./client";
import { ClientInstance } from "./ClientInstance";
import { MoveUnion } from "../common/Move";
import { PlayerENUM } from "../common/Player";
import { BoardPosition } from "../common/Position";

function printMoves(moves: Iterable<MoveUnion>) 
{
    let idx = 0;
    for (const move of moves) {
        console.log(`${idx}: ${move.toString()}`);
        idx ++;
    }
}



const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

const moveReg = /^s*(\d+)s*$/;
const pieceReg = /^s*([a-zA-Z])(\d+)s*$/;

let client: ClientInstance | null = null;
client = new ClientInstance(PlayerENUM.Black, 10);
// function makeMove(move: MoveUnion) {

// }
let moves: MoveUnion[] = [];

enum ConnectState {
    unconnected = 0,
    joined = 1
}
let status: ConnectState = ConnectState.unconnected;

rl.on("line", (input: string) => {
    if (/^\s*list\s*$/.test(input)) {
        requestServers();
        return;
    }
    if (/^\s*new\s*$/.test(input)) {
        requestMake();
        return;
    }
    let matches: RegExpExecArray | null;
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
