import { ActiveTamerlanePiece } from "./Board";
import { Player } from "./Player";

export class TamerlanePieceType {
    charRep: string;
    name: string;
    royal: boolean = false;
    constructor(charRep: string, name: string) {
        this.charRep = charRep;
        this.name = name;
    }

    makeActive(player: Player) {
        return new ActiveTamerlanePiece(this, player);
    }
}

export class PawnType extends TamerlanePieceType {
    promotion: TamerlanePieceType;
    constructor(promotion: TamerlanePieceType,
        charRep: string, name: string) {
        super(charRep, name);
        this.promotion = promotion;
    }
}


export class TamerlanePieces {
    static Elephant: TamerlanePieceType = TamerlanePieces.createPiece(
        "E",
        "Elephant"
    );
    static Camel: TamerlanePieceType = TamerlanePieces.createPiece(
        "C",
        "Camel"
    );
    static Dabbaba: TamerlanePieceType = TamerlanePieces.createPiece(
        "D",
        "Dabbaba"
    );
    static Rook: TamerlanePieceType = TamerlanePieces.createPiece(
        "R",
        "Rook"
    );
    static Picket: TamerlanePieceType = TamerlanePieces.createPiece(
        "B",
        "Picket"
    );
    static Knight: TamerlanePieceType = TamerlanePieces.createPiece(
        "N",
        "Knight"
    );
    static Giraffe: TamerlanePieceType = TamerlanePieces.createPiece(
        "F",
        "Giraffe"
    );
    static General: TamerlanePieceType = TamerlanePieces.createPiece(
        "G",
        "General"
    );
    static Vizier: TamerlanePieceType = TamerlanePieces.createPiece(
        "V",
        "Vizier"
    );



    static PawnOfElephant: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.Elephant
    );
    static PawnOfCamel: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.Camel
    );
    static PawnOfDabbaba: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.Dabbaba
    );
    static PawnOfRook: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.Rook
    );
    static PawnOfPicket: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.Picket
    );
    static PawnOfKnight: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.Knight
    );
    static PawnOfGiraffe: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.Giraffe
    );
    static PawnOfGeneral: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.General
    );
    static PawnOfVizier: PawnType = TamerlanePieces.createPawn(
        TamerlanePieces.Vizier
    );

    static King: TamerlanePieceType = TamerlanePieces.createRoyal(
        "K",
        "King"
    );
    static Prince: TamerlanePieceType = TamerlanePieces.createRoyal(
        "P",
        "Prince"
    );
    static AdventitiousKing: TamerlanePieceType = TamerlanePieces.createRoyal(
        "A",
        "Adventitious King"
    );

    static PawnOfKing: PawnType = TamerlanePieces.createPawnNamed(
        TamerlanePieces.Prince,
        "k",
        "Pawn of Kings"
    );
    static PawnOfPawns: PawnType = TamerlanePieces.createPawnNamed(
        TamerlanePieces.AdventitiousKing,
        "p",
        "Pawn of Pawns"
    );


    private static createPiece(charRep: string, name: string): TamerlanePieceType {
        let piece = new TamerlanePieceType(charRep, name);
        Object.freeze(piece);
        return piece;
    }
    private static createRoyal(charRep: string, name: string): TamerlanePieceType {
        let piece = new TamerlanePieceType(charRep, name);
        piece.royal = true;
        Object.freeze(piece);
        return piece;
    }
    private static createPawnNamed(promotion: TamerlanePieceType, charRep: string, name: string): PawnType {
        let pawn = new PawnType(
            promotion,
            charRep,
            name
        );
        Object.freeze(pawn);
        return pawn;
    }
    private static createPawn(promotion: TamerlanePieceType): PawnType {
        let pawn = new PawnType(
            promotion,
            promotion.charRep.toLowerCase(),
            `Pawn of ${promotion.name}s`
        );
        Object.freeze(pawn);
        return pawn;
    }
}