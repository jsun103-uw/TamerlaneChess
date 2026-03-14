import React from "react";
import './Endscreen.css'
import { GameResult } from "../../common/GameResult";
export interface EndscreenProperties {
    readonly victory: GameResult | null;
    readonly onExitSelected?: () => (void);
}
export default function Endscreen(props: EndscreenProperties) {
    let text = "";
    switch(props.victory) {
        case null:
            text = `Error: Illegal state`
            break;
        case GameResult.Draw:
            text = `Draw!`
            break;
        case GameResult.Lost:
            text = `You Lost!`
            break;
        case GameResult.Won:
            text = `You Won!`
            break;
    }
    return (
        <div className="endscreen-backdrop">
            <div className="endscreen">
                <p>{text}</p>
                <button
                    className="endscreen-button"
                    onClick={() => props.onExitSelected?.()}
                >
                    Exit
                </button>
            </div>
        </div>
    )
}