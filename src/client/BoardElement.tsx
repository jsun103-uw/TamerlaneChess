import React from "react";
import { Board, BoardPiece, PositionedTamerlanePiece } from "../common/Board";

export interface BoardElementProperties {
    readonly pieces: Iterable<PositionedTamerlanePiece>;
}

export default function BoardElement(props: BoardElementProperties) {
    return (
        <>
        </>
    )
}