import React from "react";
import { BoardPosition, CitadelPosition, PositionUnion } from "../common/Position";
import { getKey, makePos } from "./Utilities";
import { Player } from "../common/Player";


function makeTile(pos: PositionUnion, side: Player) {
    return (
        <div key={getKey(pos)} className={`tile-${((pos.file + pos.rank) % 2) === 0 ? "black" : "white"}`}
            style={makePos(pos, side)}>

        </div>
    )
}
export interface TamerlaneGridProperties {
    side: Player;
}
export default function TamerlaneGrid(props: TamerlaneGridProperties) {
    return (
        <>
            { /* Tiles */ }
            {
                // Create the tiles as divs by mapping a list of all possible positions to tiles
                BoardPosition.allPositions.map(
                    pos => makeTile(pos, props.side)
                )
            }
            {makeTile(CitadelPosition.getLeft(), props.side)}
            {makeTile(CitadelPosition.getRight(), props.side)}
        </>
    )
}