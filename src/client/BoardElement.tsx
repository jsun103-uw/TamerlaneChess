import React, { Component } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Board, BoardPiece, PositionedTamerlanePiece } from "../common/Board";

export interface BoardElementProperties {
    readonly pieces: Iterable<PositionedTamerlanePiece>;
}

export default function BoardElement(props: BoardElementProperties) {
    return (
        <>
    <TransformWrapper>
      <TransformComponent>
        <img src="image.jpg" alt="test" />
      </TransformComponent>
    </TransformWrapper>
        </>
    )
}