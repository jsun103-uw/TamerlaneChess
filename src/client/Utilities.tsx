import React from "react";
import { BOARD_RANKS } from "../common/Consts"
import { PositionUnion } from "../common/Position"
import PositionedCSSProperties from "./PositionedCSSProperties"

const tileSize: number = 64;
export function makePos(pos: PositionUnion): PositionedCSSProperties {
    return {
        "--x": `${(pos.file + 1) * tileSize}px`,
        "--y": `${(BOARD_RANKS - 1 - pos.rank) * tileSize}px`,
    }
}


export function getKey(pos: PositionUnion): string {
    return `${pos.file}-${pos.rank}`
}