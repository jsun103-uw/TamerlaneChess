import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Board, BoardPiece, PositionedTamerlanePiece } from "../common/Board";
import getImgSrc from "./PieceImgLibrary";
import React from "react";
import PositionedCSSProperties from "./PositionedCSSProperties";

import './BoardElement.css'
import { BoardPosition, CitadelPosition, PositionUnion } from "../common/Position";
import { BOARD_FILES, BOARD_RANKS } from "../common/Consts";

export interface BoardElementProperties {
    readonly pieces: PositionedTamerlanePiece[];
}

const tileSize: number = 64;
function makePos(pos: PositionUnion): PositionedCSSProperties {
    return {
        "--x": `${(pos.file + 1) * tileSize}px`,
        "--y": `${(BOARD_RANKS - 1 - pos.rank) * tileSize}px`,
    }
}
function getKey(pos: PositionUnion): string {
    return `${pos.file}-${pos.rank}`
}
function makeTile(pos: PositionUnion) {
    return (
        <div key={getKey(pos)} className={`tile-${((pos.file + pos.rank) % 2) === 0 ? "black" : "white"}`}
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
                            pos => makeTile(pos)
                        )
                    }
                    {makeTile(CitadelPosition.getLeft())}
                    {makeTile(CitadelPosition.getRight())}
                    {props.pieces.map(piece => {
                        return (
                            <button className="board-piece" style={makePos(piece.position)} key={getKey(piece.position)}>
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