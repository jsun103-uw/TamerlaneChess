import { Board, BoardPiece, PositionedTamerlanePiece } from "../common/Board";
import getImgSrc from "./PieceImgLibrary";
import React, { useState } from "react";
import PositionedCSSProperties from "./PositionedCSSProperties";

import { getKey, makePos } from "./Utilities";
import { BoardPosition, PositionUnion } from "../common/Position";

export interface BoardElementProperties {
    readonly pieces: PositionedTamerlanePiece[];
    readonly onSelect?: (pos: PositionUnion) => (void);
}

const tileSize: number = 64;
export default function TamerlanePieces(props: BoardElementProperties) {
    return (
        <>
            {
                props.pieces.map(
                    piece => {
                        return (
                            <button 
                                onClick={() => { 
                                    if (props.onSelect) {
                                        props.onSelect(piece.position); 
                                    }
                                }}
                                className="board-piece" 
                                style={makePos(piece.position)} 
                                key={getKey(piece.position)}>
                                <img className="piece-icon" src={getImgSrc(piece.piece, piece.side)} />
                            </button>
                        )
                    }
                )
            }
        </>
    )
}