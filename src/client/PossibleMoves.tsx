import { Board, BoardPiece, PositionedTamerlanePiece } from "../common/Board";
import getImgSrc from "./PieceImgLibrary";
import React, { useState } from "react";
import PositionedCSSProperties from "./PositionedCSSProperties";

import { getKey, makePos } from "./Utilities";
import { MoveUnion } from "../common/Move";
import { ClientInstance } from "./ClientInstance";
import { Player } from "../common/Player";

export interface PossibleMovesProperties {
    readonly client: ClientInstance | null;
    readonly possibleMoves: MoveUnion[];
    readonly side: Player;
    readonly onSelect?: (move: MoveUnion) => (void);
}

export default function PossibleMoves(props: PossibleMovesProperties) {
    console.log(props.possibleMoves)
    return (
        <>
            {
                props.possibleMoves.map(
                    move => {
                        return (
                            <button 
                                className="indicator-button" 
                                onClick={() => {
                                    if (props.onSelect) props.onSelect(move);
                                }}
                                style={makePos(move.end, props.side)} 
                                key={getKey(move.end)}
                            >
                                <img
                                    className="indicator-icon" 
                                    src="/res/IndicatorEmpty.png"/>
                            </button>
                        )
                    }
                )
            }
        </>
    )
}