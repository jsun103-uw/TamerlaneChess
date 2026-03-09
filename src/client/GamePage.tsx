import React, { useState, memo, useReducer, useRef, RefObject, useEffect } from "react";
import TamerlanePieces from "./TamerlanePieces";
import { ClientInstance } from "./ClientInstance";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import TamerlaneGrid from "./TamerlaneGrid";
import PossibleMoves from "./PossibleMoves";
import { BoardPosition, PositionUnion } from "../common/Position";
import './GamePage.css'
import { MoveUnion } from "../common/Move";
import { opposingPlayerTo, PlayerENUM } from "../common/Player";
import Endscreen from "./Endscreen";
import PlayerInfo from "./PlayerInfo";
import { TamerlanePieceType } from "../common/TamerlanePieces";

interface GamePageProperties {
    readonly instance: ClientInstance | null;
}

export default function GamePage(props: GamePageProperties) {
    const [moves, setMoves] = useState<MoveUnion[]>([]);
    const movePolling: RefObject<NodeJS.Timeout | null> = useRef<NodeJS.Timeout | null>(null);
    // interval = setInterval(() => {
    //     if (location)
    // }, 500)
    function clearMoves() {
        // clears possible moves after success.
        // doubles as re-render
        setMoves([]);
    }
    function trymove(move: MoveUnion) {
        props.instance?.postMove(move, clearMoves);
    }
    useEffect(
        () => {
            movePolling.current = setInterval(() => {
                props.instance?.pollUpdate(clearMoves);
            }, 100);
            return () => {
                if (movePolling.current) clearInterval(movePolling.current);
            }
        }, []
    )
    return (
        <>
            <div className="game-page d-flex flex-column">
                <div></div>
                <PlayerInfo 
                    losses={[]}
                    name="temp"
                    side={props.instance !== null ? opposingPlayerTo(props.instance.side) : PlayerENUM.Black}
                />
                <div className="transformStage">
                    <TransformWrapper
                        minScale={0.5}
                        maxScale={1.2}
                        limitToBounds={true}
                        disablePadding={true}
                        centerZoomedOut={true}
                        maxPositionX={1000}
                        maxPositionY={1000}
                    >
                        <TransformComponent>
                            <div className="table">
                                <div className="board">
                                    <TamerlaneGrid side={props.instance?.side ?? PlayerENUM.White} />
                                    <TamerlanePieces 
                                        onSelect={(pos: PositionUnion) => {
                                            if (props.instance) {
                                                setMoves([...props.instance.getMovesFor(pos)]);
                                            }
                                        }}
                                        pieces={props.instance ? [...props.instance.getPieces()] : []} 
                                        side={props.instance?.side ?? PlayerENUM.White}
                                    />
                                    <PossibleMoves 
                                        client={props.instance} 
                                        possibleMoves={props.instance !== null ? [...moves] : []}
                                        onSelect={(move: MoveUnion) => {
                                            trymove(move);
                                        }}
                                        side={props.instance?.side ?? PlayerENUM.White}
                                    />
                                </div>
                            </div>
                        </TransformComponent>
                    </TransformWrapper>
                </div>
                <PlayerInfo 
                    losses={[]}
                    name="temp"
                    side={props.instance?.side ?? PlayerENUM.White}
                />
            </div>
            <Endscreen 
                visible={false}
                victory={false} 
                opponentName="temp" 
                onExitSelected={
                    () => {
                        console.log("Exit selected");
                    }
                } 
                onRematchSelected={
                    () => {
                        console.log("Rematch selected");
                    }
                }
            />
        </>
    )
}