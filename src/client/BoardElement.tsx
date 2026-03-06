import { Component } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Board, BoardPiece, PositionedTamerlanePiece } from "../common/Board";
import getImgSrc from "./PieceImgLibrary";
import React from "react";
import PositionedCSSProperties from "./PositionedCSSProperties";

import './BoardElement.css'

export interface BoardElementProperties {
    readonly pieces: PositionedTamerlanePiece[];
}
export default function BoardElement(props: BoardElementProperties) {
    return (
        <TransformWrapper>
            <TransformComponent wrapperClass="viewport"
                    contentClass="canvas">
                <div className="board">
                    {props.pieces.map(piece => {
                        const style: PositionedCSSProperties = {
                            "--x": `${(piece.position.file + 2) * 64}px`,
                            "--y": `${piece.position.rank * 64}px`,
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