import { validateFen } from "chess.js";
import { parseGame } from "@mliebelt/pgn-parser";

import Game from "shared/types/game/Game";
import { GameResult } from "shared/constants/game/GameResult";
import { PieceColour } from "shared/constants/PieceColour";
import Variant from "shared/constants/game/Variant";
import { STARTING_FEN } from "shared/constants/utils";

function parseResultString(result: string, colour: PieceColour) {
    if (result == "1/2-1/2") return GameResult.DRAW;
    if (result == "*") return GameResult.UNKNOWN;

    const winningResult = colour == PieceColour.WHITE ? "1-0" : "0-1";

    return result == winningResult ? GameResult.WIN : GameResult.LOSE;
}

function parsePgn(pgn: string): Game {
    const sanitisedPGN = pgn.replace(/("])\n(\d+\.)/, "$1\n\n$2");

    const game = parseGame(sanitisedPGN);

    const headers = game.tags as any;

    const variant = headers["Variant"] == "Chess960"
        ? Variant.CHESS960 : Variant.STANDARD;

    const initialPosition = (headers["FEN"] && validateFen(headers["FEN"]).ok)
        ? headers["FEN"] : STARTING_FEN;

    const ratings = {
        white: parseInt(headers["WhiteElo"] || ""),
        black: parseInt(headers["BlackElo"] || "")
    };

    return {
        pgn: sanitisedPGN,
        players: {
            white: {
                username: headers["White"] || "White",
                title: headers["WhiteTitle"],
                rating: isNaN(ratings.white) ? undefined : ratings.white,
                image: headers["WhiteUrl"],
                result: parseResultString(
                    headers["Result"],
                    PieceColour.WHITE
                )
            },
            black: {
                username: headers["Black"] || "Black",
                title: headers["BlackTitle"],
                rating: isNaN(ratings.black) ? undefined : ratings.black,
                image: headers["BlackUrl"],
                result: parseResultString(
                    headers["Result"],
                    PieceColour.BLACK
                )
            }
        },
        variant: variant,
        initialPosition: initialPosition
    };
}

export default parsePgn;