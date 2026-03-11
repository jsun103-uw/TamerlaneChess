import React, { useState, memo, useReducer, useRef, RefObject, useEffect } from "react";
import TamerlanePieces from "./TamerlanePieces";
import { ClientInstance } from "../ClientInstance";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import TamerlaneGrid from "./TamerlaneGrid";
import PossibleMoves from "./PossibleMoves";
import { BoardPosition, PositionUnion } from "../../common/Position";
import './GamePage.css'
import { MoveUnion } from "../../common/Move";
import { opposingPlayerTo, PlayerENUM } from "../../common/Player";
import Endscreen from "./Endscreen";
import PlayerInfo from "./PlayerInfo";
import { TamerlanePieceType } from "../../common/TamerlanePieces";

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

    function pingUpdate() {
        if (movePolling.current) clearTimeout(movePolling.current);
        movePolling.current = setTimeout(async () => {
            await props.instance?.pollUpdate(clearMoves);
            //set timer again
            pingUpdate();
        }, 200)
    }
    useEffect(
        () => {
            pingUpdate();
            return () => {
                if (movePolling.current) clearInterval(movePolling.current);
            }
        }, []
    )

    let infoFloat = <></>;
    if (props.instance) {
        console.log("is not turn? " + !props.instance.isTurn())
        if (!props.instance.isTurn()) {
            console.log("wtf");
            infoFloat = 
                <div className="info-float">
                    <p>Waiting for black</p>
                </div>
        }
        else if (props.instance.isChecked()) {
            infoFloat = 
                <div className="info-float">
                    <p>Checked!</p>
                </div>
        }
    }

    return (
        <>
            <div className="game-page d-flex flex-column">
                <div></div>
                <PlayerInfo 
                    score={props.instance !== null ? [...props.instance.getLosses()] : []}
                    name={props.instance?.opponentName ?? "opponent"}
                    side={props.instance !== null ? opposingPlayerTo(props.instance.side) : PlayerENUM.Black}
                />
                <div className="transform-stage">
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
                    {infoFloat}
                </div>
                <PlayerInfo 
                    score={props.instance !== null ? [...props.instance.getCaptured()] : []}
                    name={props.instance?.displayName ?? "player"}
                    side={props.instance?.side ?? PlayerENUM.White}
                />
            </div>
            {
                (props.instance) ?
                <Endscreen 
                    visible={props.instance.isGameEnded()}
                    victory={props.instance.isWon()} 
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
                : <></>
            }
        </>
    )
}