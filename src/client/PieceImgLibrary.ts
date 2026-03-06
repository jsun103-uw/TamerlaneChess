import { TamerlanePiece } from "../common/Board";
import { Player, PlayerENUM } from "../common/Player";
import { PawnType, TamerlanePieceType } from "../common/TamerlanePieces";

export default function getImgSrc(pieceType: TamerlanePieceType, side: Player): string {
    let path: string = "res/";

    if (pieceType instanceof PawnType) {
        path += "Pawn";
        console.log("hi");
    }
    switch(pieceType.charRep) {
        case "E":
        case "e":
            path += "Elephant";
            break;
        case "C":
        case "c":
            path += "Camel";
            break;
        case "D":
        case "d":
            path += "Dabbaba";
            break;
        case "R":
        case "r":
            path += "Rook";
            break;
        case "B":
        case "b":
            path += "Picket";
            break;
        case "N":
        case "n":
            path += "Knight";
            break;
        case "F":
        case "f":
            path += "Giraffe";
            break;
        case "G":
        case "g":
            path += "General";
            break;
        case "V":
        case "v":
            path += "Vizier";
            break;

        case "K":
        case "k":
            path += "King";
            break;
        case "P": //TODO? custom sprite
            path += "King";
            break;
        case "A": //TODO? custom sprite
            path += "King";
            break;
        case "p":
            path += "Pawn";
            break;
        default:
            path = "ERROR";
    }
    if (side === PlayerENUM.Black) {
        path += "B";
    }
    return path + ".png";
}