import React from "react";
import { TamerlanePieceType } from "../../common/TamerlanePieces";
import getImgSrc from "../PieceImgLibrary";
import { Player } from "../../common/Player";
import './PlayerInfo.css';

export interface PlayerInfoProperties {
    readonly side: Player;
    readonly score: TamerlanePieceType[];
}
export default function PlayerInfo(props: PlayerInfoProperties) {
    return (
        <section className="player-info">
            <div className="player-info-pieces">
                {props.score.map((piece, index) => (
                    <img
                        className="icon-captured" 
                        key={`${props.side}-${piece}-${index}`}
                        src={getImgSrc(piece, props.side)}
                    />
                ))}
            </div>
        </section>
    )
}