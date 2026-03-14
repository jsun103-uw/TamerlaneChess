//! This file contains old tests ran to validate the board behavior
//npx tsx src/common/testboard.ts
import { Board } from "./Board.js";
import { Game } from "./Game.js";
import { ExchangeMove, MoveUnion, TakeMove } from "./Move.js";
import { PlayerENUM } from "./Player.js";
import { BoardPosition } from "./Position.js";
import { TamerlanePieces } from "./TamerlanePieces.js";

let game: Game = new Game();


console.log("State 1");
console.log(game.debugGetBoard());

//!! example of getting all the pieces
// for (const tamerlanepiece of game.getPieces()) {
//     console.log(tamerlanepiece.toString());
// }
//!!



//* showing moves

// console.log("Pawn A3 moves");
// printMoves(game.getMovesFor(new BoardPosition(0, 2)));
// console.log("Knight B2 moves");
// printMoves(game.getMovesFor(new BoardPosition(1, 1)));





//* Command line board
import * as readline from "readline";
import { printMoves } from "./Utility.js";

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
    if (/^\s*test\s*$/.test(input)) {
        testBoardPromotion();
        return;
    }
    if (/^\s*check\s*$/.test(input)) {
        testCheck();
        return;
    }
    let matches: RegExpExecArray | null;
    matches = moveReg.exec(input);
    if (matches !== null) {
        let moveidx: number = parseInt(matches[1]);
        if (moveidx >= 0 && moveidx < moves.length ) {

            console.log(`selecting move ${moveidx}: ${moves[moveidx]}`);
            if (game.trymove(moves[moveidx]))
            {
                console.log(game.debugGetBoard());
            }
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
                moves = [...game.getMovesFor(pos, game.turn)];
                printMoves(moves);
            }
            else console.log(`Position does not exist`);
        }
    }
});

rl.on("close", () => {
  process.exit(0);
});






let state = 0;
// * testing boards
function testBoardPromotion() {
    let game: Game = new Game();
    state = 0;

    printStart(game);

    // advance K and I file pawn of rooks
    moveState(game, TakeMove.tryMake(10, 2, 10, 3));
    moveState(game, TakeMove.tryMake(8, 7, 8, 6));
    moveState(game, TakeMove.tryMake(10, 3, 10, 4));
    moveState(game, TakeMove.tryMake(8, 6, 8, 5));
    moveState(game, TakeMove.tryMake(10, 4, 10, 5));
    moveState(game, TakeMove.tryMake(8, 5, 8, 4));
    moveState(game, TakeMove.tryMake(10, 5, 10, 6));
    moveState(game, TakeMove.tryMake(8, 4, 8, 3));
    // take pawn at pawn rank
    moveState(game, TakeMove.tryMake(10, 6, 9, 7));
    moveState(game, TakeMove.tryMake(8, 3, 9, 2));
    //move camel out of way
    moveState(game, TakeMove.tryMake(8, 0, 9, 3));
    moveState(game, TakeMove.tryMake(8, 9, 9, 6));
    // continue pawn advance
    moveState(game, TakeMove.tryMake(9, 7, 8, 8));
    moveState(game, TakeMove.tryMake(9, 2, 8, 1));
    // promote
    moveState(game, TakeMove.tryMake(8, 8, 8, 9));
    moveState(game, TakeMove.tryMake(8, 1, 8, 0));
}
/**
 * Tests putting the kings in check
 */
function testCheck() {
    let game: Game = new Game();
    state = 0;

    printStart(game);
    assertFalse(game.debugBoardReference().checkCheck(PlayerENUM.Black), "should not yet be checking king");
    moveState(game, TakeMove.tryMake(3, 2, 3, 3));
    moveState(game, TakeMove.tryMake(1, 8, 0, 6));

    assertFalse(game.debugBoardReference().checkCheck(PlayerENUM.Black), "should not yet be checking king");
    moveState(game, TakeMove.tryMake(3, 3, 3, 4));
    moveState(game, TakeMove.tryMake(0, 6, 1, 8));

    assertFalse(game.debugBoardReference().checkCheck(PlayerENUM.Black), "should not yet be checking king");
    moveState(game, TakeMove.tryMake(3, 4, 3, 5));
    moveState(game, TakeMove.tryMake(1, 8, 0, 6));

    assertFalse(game.debugBoardReference().checkCheck(PlayerENUM.Black), "should not yet be checking king");
    moveState(game, TakeMove.tryMake(3, 5, 3, 6));
    moveState(game, TakeMove.tryMake(0, 6, 1, 8));

    assertFalse(game.debugBoardReference().checkCheck(PlayerENUM.Black), "should not yet be checking king");
    moveState(game, TakeMove.tryMake(3, 6, 4, 7));
    assertTrue(game.debugBoardReference().checkCheck(PlayerENUM.Black), "should be checking king");
    assertEmpty<MoveUnion>([...game.getMovesFor(new BoardPosition(1, 8), game.turn)], "knight should not be able to stop check");

}
function printStart(game: Game) {
    console.log(`=======================`)
    console.log(`=======================`)
    console.log(`        TESTING        `)
    console.log(`=======================`)
    console.log(`=======================`)

    console.log(`Initial State`);
    console.log(game.debugGetBoard());
}
function moveState(game: Game, move: MoveUnion | null) {
    if (move === null || !game.trymove(move)) {
        console.log(`Move ${state ++} failed: ${move === null ? "" : move.toString()}`);
        return;
    };
    console.log(`Move ${state ++}: ${move.toString()}`);
    game.trymove(move);
    console.log(game.debugGetBoard());
}

function assertTrue(actual: boolean, message: string) {
    if (!actual) {
        throw new Error(`Value was false when expected true: ${message}`);
    }
}
function assertFalse(actual: boolean, message: string) {
    if (actual) {
        throw new Error(`Value was false when expected true: ${message}`);
    }
}
function assertEmpty<T>(arr: Array<T>, message: string) {
    if (arr.length !== 0) {
        for(const item of arr) console.error(item);
        throw new Error(`array was not empty: ${message}`);
    }
}