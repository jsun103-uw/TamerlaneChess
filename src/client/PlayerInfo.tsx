import React from "react";
import { TamerlanePieceType } from "../common/TamerlanePieces";
import getImgSrc from "./PieceImgLibrary";
import { Player } from "../common/Player";
import './PlayerInfo.css';

export interface PlayerInfoProperties {
    readonly name: string;
    readonly side: Player;
    readonly score: TamerlanePieceType[];
}
export default function PlayerInfo(props: PlayerInfoProperties) {
    return (
        <div className="flex-wrap align-items-center player-info">
            <p>{props.name}</p>
            <div className="d-flex flex-row align-items-center">
                {props.score.map(piece => (
                    <img
                        className="icon-captured" 
                        src={getImgSrc(piece, props.side)}
                    />
                ))}
            </div>
        </div>
    )
}