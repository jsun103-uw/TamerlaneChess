import { Component } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Board, BoardPiece, PositionedTamerlanePiece } from "../common/Board";
import getImgSrc from "./PieceImgLibrary";
import React from "react";
import PositionedCSSProperties from "./PositionedCSSProperties";

import './BoardElement.css'
import { BoardPosition } from "../common/Position";

export interface BoardElementProperties {
    readonly pieces: PositionedTamerlanePiece[];
}

const tileSize: number = 64;

export default function BoardElement(props: BoardElementProperties) {
    return (
        <TransformWrapper>
            <TransformComponent wrapperClass="viewport"
                    contentClass="canvas">
                <div className="board">
                    {
                        // Create the tiles as divs by mapping a list of all possible positions to tiles
                        BoardPosition.allPositions.map(
                            pos => {
                                const style: PositionedCSSProperties = {
                                    "--x": `${(pos.file + 1) * tileSize}px`,
                                    "--y": `${pos.rank * tileSize}px`,
                                }
                                return (
                                    <div className={`tile-${((pos.file + pos.rank) % 2) === 0 ? "black" : "white"}`}
                                        style={style}>

                                    </div>
                                )
                            }
                        )
                    }
                    {props.pieces.map(piece => {
                        const style: PositionedCSSProperties = {
                            "--x": `${(piece.position.file + 1) * tileSize}px`,
                            "--y": `${piece.position.rank * tileSize}px`,
                        }
                        return (
                            <button className="board-piece" style={style}>
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