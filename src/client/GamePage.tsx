import { Component, useReducer, useRef } from "react";
import React, { useState } from "react";
import TamerlanePieces from "./TamerlanePieces";
import { Board } from "../common/Board";
import { ClientInstance } from "./ClientInstance";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import TamerlaneGrid from "./TamerlaneGrid";

interface GamePageProperties {
    readonly instance: ClientInstance | null;
}

export default function GamePage(props: GamePageProperties) {
    return (
        <>
            <TransformWrapper>
                <TransformComponent wrapperClass="viewport"
                        contentClass="canvas">
                    <div className="board">
                        <TamerlaneGrid />
                        <TamerlanePieces 
                            pieces={props.instance !== null ? [...props.instance.getPieces()] : []} 
                        />
                    </div>
                </TransformComponent>
            </TransformWrapper>
        </>
    )
}