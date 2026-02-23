export type Player = typeof PlayerENUM.White | typeof PlayerENUM.Black;
export const PlayerENUM = {
    White: "white",
    Black: "black",
} as const;
export function opposingPlayerTo(player: Player) {
    if (player === PlayerENUM.White) return PlayerENUM.Black;
    else return PlayerENUM.White;
}

