import React from "react";
import './Endscreen.css'
export interface EndscreenProperties {
    readonly visible: boolean;
    readonly victory: boolean;
    readonly opponentName: string;
    readonly onRematchSelected?: () => (void);
    readonly onExitSelected?: () => (void);
}
export default function Endscreen(props: EndscreenProperties) {
    if (!props.visible) return;
    return (
        <div className="endscreen">
            <p>
                {
                    props.victory ?
                    `You defeated ${props.opponentName}`
                    : `You were defeated by ${props.opponentName}`
                }
            </p>
            <button
                onClick={() => props.onRematchSelected?.()}
            >
                Request Rematch
            </button>
            <button
                onClick={() => props.onExitSelected?.()}
            >
                Exit
            </button>
        </div>
    )
}