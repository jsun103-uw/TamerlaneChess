import { Component } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Board, BoardPiece, PositionedTamerlanePiece } from "../common/Board";
import getImgSrc from "./PieceImgLibrary";
import React from "react";
import PositionedCSSProperties from "./PositionedCSSProperties";

import './BoardElement.css'
import { BoardPosition, PositionUnion } from "../common/Position";

export interface BoardElementProperties {
    readonly pieces: PositionedTamerlanePiece[];
}

const tileSize: number = 64;
function makePos(pos: PositionUnion): PositionedCSSProperties {
    return {
        "--x": `${(pos.file + 1) * tileSize}px`,
        "--y": `${pos.rank * tileSize}px`,
    }
}
function maketile(pos: PositionUnion) {
    return (
        <div className={`tile-${((pos.file + pos.rank) % 2) === 0 ? "black" : "white"}`}
            style={makePos(pos)}>

        </div>
    )
}
export default function BoardElement(props: BoardElementProperties) {
    return (
        <TransformWrapper>
            <TransformComponent wrapperClass="viewport"
                    contentClass="canvas">
                <div className="board">
                    {
                        // Create the tiles as divs by mapping a list of all possible positions to tiles
                        BoardPosition.allPositions.map(
                            pos => maketile(pos)
                        )
                    }
                    {props.pieces.map(piece => {
                        return (
                            <button className="board-piece" style={makePos(piece.position)}>
                                <img className="piece-icon" src={getImgSrc(piece.piece, piece.side)}></img>
                            </button>
                        )
                    })
                    }
                </div>
            </TransformComponent>
        </TransformWrapper>
    )
}