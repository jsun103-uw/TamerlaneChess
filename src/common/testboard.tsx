//npx tsx src/common/testboard.tsx 
import { Board } from "./Board";
import { Move, TakeMove } from "./Move";
import { BoardPosition } from "./Position";

let board: Board = Board.buildStartingBoard();


console.log("State 1");
console.log(board.debugGet());
board.move(new TakeMove(new BoardPosition(1, 1), new BoardPosition(1, 4)));
console.log("State 2");
console.log(board.debugGet());


// Examples for using getPieces();
for (const piece of board.getPieces()) {
    // console.log(`${piece.side}'s ${piece.piece.name} at ${piece.position}`);
}