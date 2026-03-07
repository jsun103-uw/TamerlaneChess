import { Component, useReducer, useRef } from "react";
import React, { useState } from "react";
import BoardElement from "./BoardElement";
import { Board } from "../common/Board";
import { ClientInstance } from "./ClientInstance";

interface GamePageProperties {
    readonly instance: ClientInstance | null;
}

export default function GamePage(props: GamePageProperties) {
    return (
        <>
            <BoardElement pieces={props.instance !== null ? [...props.instance.getPieces()] : []}>
                
            </BoardElement>
        </>
    )
}