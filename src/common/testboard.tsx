//npx tsx src/common/testboard.tsx 
import { Board } from "./Board";
import { Move, TakeMove } from "./Move";
import { PlayerENUM } from "./Player";
import { BoardPosition } from "./Position";
import { TamerlanePieces } from "./TamerlanePieces";

let board: Board = Board.buildStartingBoard();


console.log("State 1");
console.log(board.debugGet());
board.move(new TakeMove(new BoardPosition(1, 1), new BoardPosition(1, 4)));
console.log("State 2");
console.log(board.debugGet());


console.log(`imaginary Picket @ 2, 2`);
for (const move of TamerlanePieces.Picket.getMoves(board, new BoardPosition(2, 2), PlayerENUM.White)) {
    console.log(move.toString());
}

const testpawnpos = new BoardPosition(4, 4);
console.log(`Pawn @ ${testpawnpos}`);
for (const move of TamerlanePieces.PawnOfCamel.getMoves(board, testpawnpos, PlayerENUM.Black)) {
    console.log(move.toString());
}


// Examples for using getPieces();
for (const piece of board.getPieces()) {
    // console.log(`${piece.side}'s ${piece.piece.name} at ${piece.position}`);
}