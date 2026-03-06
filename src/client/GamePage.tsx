import React, { useState } from "react";
import BoardElement from "./BoardElement";
import { Board } from "../common/Board";


export default function GamePage() {
    const [board, setBoard] = useState(Board.buildStartingBoard());
    return (
        <>
            <BoardElement pieces={board.getPieces()}>
                
            </BoardElement>
        </>
    )
}