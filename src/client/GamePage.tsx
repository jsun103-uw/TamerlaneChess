import React, { useState, memo } from "react";
import TamerlanePieces from "./TamerlanePieces";
import { ClientInstance } from "./ClientInstance";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import TamerlaneGrid from "./TamerlaneGrid";
import PossibleMoves from "./PossibleMoves";
import { BoardPosition } from "../common/Position";
import './GamePage.css'

interface GamePageProperties {
    readonly instance: ClientInstance | null;
}

export default function GamePage(props: GamePageProperties) {
    useState();
    return (
        <>
            <TransformWrapper>
                <TransformComponent 
                    wrapperClass="viewport"
                    contentClass="canvas"
                >
                    <div className="board">
                        <TamerlaneGrid />
                        <TamerlanePieces 
                            pieces={props.instance !== null ? [...props.instance.getPieces()] : []} 
                        />
                        <PossibleMoves 
                            client={props.instance} 
                            possibleMoves={props.instance !== null ? [...props.instance.getMovesFor(new BoardPosition(2, 2))] : []}
                        />
                    </div>
                </TransformComponent>
            </TransformWrapper>
        </>
    )
}