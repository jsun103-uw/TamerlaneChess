import React from "react";
import { TamerlanePieceType } from "../common/TamerlanePieces";
import getImgSrc from "./PieceImgLibrary";
import { Player } from "../common/Player";

export interface PlayerInfoProperties {
    readonly name: string;
    readonly side: Player;
    readonly losses: TamerlanePieceType[];
}
export default function PlayerInfo(props: PlayerInfoProperties) {
    return (
        <div className="flex-wrap align-items-center player-info">
            <p>{props.name}</p>
            <div className="d-flex flex-row align-items-center">
                {props.losses.map(piece => (
                    <img src={getImgSrc(piece, props.side)}/>
                ))}
            </div>
        </div>
    )
}