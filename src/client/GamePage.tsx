import React, { useState, memo } from "react";
import TamerlanePieces from "./TamerlanePieces";
import { ClientInstance } from "./ClientInstance";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import TamerlaneGrid from "./TamerlaneGrid";
import PossibleMoves from "./PossibleMoves";
import { BoardPosition, PositionUnion } from "../common/Position";
import './GamePage.css'
import { MoveUnion } from "../common/Move";

interface GamePageProperties {
    readonly instance: ClientInstance | null;
}

export default function GamePage(props: GamePageProperties) {
    const [moves, setMoves] = useState<MoveUnion[]>([]);
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
                            onSelect={(pos: PositionUnion) => {
                                if (props.instance) {
                                    setMoves([...props.instance.getMovesFor(pos)]);
                                }
                            }}
                            pieces={props.instance !== null ? [...props.instance.getPieces()] : []} 
                        />
                        <PossibleMoves 
                            client={props.instance} 
                            possibleMoves={props.instance !== null ? [...moves] : []}
                        />
                    </div>
                </TransformComponent>
            </TransformWrapper>
        </>
    )
}