
export type Player = typeof PlayerENUM.White | typeof PlayerENUM.Black;export const PlayerENUM = {
    White: "white",
    Black: "black",
} as const;

