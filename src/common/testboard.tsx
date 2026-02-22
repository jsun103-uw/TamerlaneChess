//npx tsx src/common/testboard.tsx 
import { Board } from "./Board";

let board: Board = Board.buildStartingBoard();


console.log(board.debugGet());