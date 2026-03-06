import React, { useState } from "react";
import BoardElement from "./BoardElement";
import { Board } from "../common/Board";


export default function GamePage() {
    const [board, setBoard] = useState(Board.buildStartingBoard());
    console.log([...board.getPieces()]);
    return (
        <>
            <BoardElement pieces={[...board.getPieces()]}>
                
            </BoardElement>
        </>
    )
}