import React from "react";
import { BOARD_FILES, BOARD_RANKS } from "../../common/Consts"
import { PositionUnion } from "../../common/Position"
import PositionedCSSProperties from "./PositionedCSSProperties"
import { Player, PlayerENUM } from "../../common/Player";

const tileSize: number = 64;

/**
 * Coverts game position into a CSS position in the perspective of the player's side
 * @param pos 
 * @param side 
 * @returns 
 */
export function makePos(pos: PositionUnion, side: Player): PositionedCSSProperties {
    if (side === PlayerENUM.White) {
        return {
            "--x": `${(pos.file + 1) * tileSize}px`,
            "--y": `${(BOARD_RANKS - 1 - pos.rank) * tileSize}px`,
        }
    }
    else {
        return {
            "--x": `${(BOARD_FILES - pos.file) * tileSize}px`,
            "--y": `${pos.rank * tileSize}px`,
        }
    }
}


export function getKey(pos: PositionUnion): string {
    return `${pos.file}-${pos.rank}`
}