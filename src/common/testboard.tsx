//npx tsx src/common/testboard.tsx 
import { Board } from "./Board";
import { ExchangeMove, Move, MoveUnion, TakeMove } from "./Move";
import { PlayerENUM } from "./Player";
import { BoardPosition } from "./Position";
import { TamerlanePieces } from "./TamerlanePieces";

let board: Board = Board.buildStartingBoard();


console.log("State 1");
console.log(board.debugGet());
board.trymove(new TakeMove(new BoardPosition(1, 1), new BoardPosition(1, 4)));
console.log("State 2");
console.log(board.debugGet());


// console.log(`imaginary Picket @ 2, 2`);
// for (const move of TamerlanePieces.Picket.getMoves(board, new BoardPosition(2, 2), PlayerENUM.White)) {
//     console.log(move.toString());
// }

//* showing moves

// const testpawnpos = new BoardPosition(1, 2);
// printMoves(TamerlanePieces.PawnOfCamel.getMoves(board, testpawnpos, PlayerENUM.White));


// console.log(`Knight @ ${testpawnpos}`);
// printMoves(board.getMoves(testpawnpos));

//* showing pieces

// Examples for using getPieces();
// for (const piece of board.getPieces()) {
//     console.log(`${piece.side}'s ${piece.piece.name} at ${piece.position}`);
// }

function printMoves(moves: Iterable<MoveUnion>) 
{
    let idx = 0;
    for (const move of moves) {
        console.log(`${idx}: ${move.toString()}`);
        idx ++;
    }
}

//* Command line board
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

const moveReg = /^s*(\d+)s*$/;
const pieceReg = /^s*([a-zA-Z])(\d+)s*$/;

let side = PlayerENUM.White;
// function makeMove(move: MoveUnion) {

// }
let moves: MoveUnion[] = [];

rl.on("line", (input: string) => {
    let matches: RegExpExecArray | null;
    matches = moveReg.exec(input);
    if (matches !== null) {
        let moveidx: number = parseInt(matches[1]);
        if (moveidx >= 0 && moveidx < moves.length ) {

            console.log(`selecting move ${moveidx}: ${moves[moveidx]}`);
            if (board.trymove(moves[moveidx]))
            {
                console.log(board.debugGet());
            }
            return;
        }
        else console.log(`Failed to find move index ${moveidx}`);
    }
    matches = pieceReg.exec(input);
    if (matches !== null) {
        if (matches !== null) {
            let pos: BoardPosition | null = BoardPosition.trymake(matches[1].toUpperCase().charCodeAt(0) - 65, parseInt(matches[2]) - 1);
            if (pos !== null && board.getPiece(pos)?.side === side) {
                moves = [...board.getMoves(pos)];
                printMoves(moves);
                if (moves.length === 0) console.log(`No moves at ${pos?.toString()}`);
            }
            else 
            {
                if (pos === null) console.log(`Position does not exist`);
                else console.log(`No piece at ${pos}`);
                moves = [];
            }
        }
    }
});

rl.on("close", () => {
  process.exit(0);
});