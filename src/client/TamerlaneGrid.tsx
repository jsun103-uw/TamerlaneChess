import React from "react";
import { BoardPosition, CitadelPosition, PositionUnion } from "../common/Position";
import { getKey, makePos } from "./Utilities";


function makeTile(pos: PositionUnion) {
    return (
        <div key={getKey(pos)} className={`tile-${((pos.file + pos.rank) % 2) === 0 ? "black" : "white"}`}
            style={makePos(pos)}>

        </div>
    )
}
export default function TamerlaneGrid() {
    return (
        <>
            { /* Tiles */ }
            {
                // Create the tiles as divs by mapping a list of all possible positions to tiles
                BoardPosition.allPositions.map(
                    pos => makeTile(pos)
                )
            }
            {makeTile(CitadelPosition.getLeft())}
            {makeTile(CitadelPosition.getRight())}
        </>
    )
}