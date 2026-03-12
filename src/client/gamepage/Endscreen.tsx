import React from "react";
import './Endscreen.css'
export interface EndscreenProperties {
    readonly victory: boolean;
    readonly opponentName: string;
    readonly onExitSelected?: () => (void);
}
export default function Endscreen(props: EndscreenProperties) {
    return (
        <div className="endscreen">
            <p>
                {
                    props.victory ?
                    `You won!`
                    : `You lost!`
                    // props.victory ?
                    // `You defeated ${props.opponentName}`
                    // : `You were defeated by ${props.opponentName}`
                }
            </p>
            <button
                onClick={() => props.onExitSelected?.()}
            >
                Exit
            </button>
        </div>
    )
}