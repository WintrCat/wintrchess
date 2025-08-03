import { Chess } from "chess.js";

import Game from "shared/types/game/Game";
import { GameResult } from "shared/constants/game/GameResult";
import Variant from "shared/constants/game/Variant";

function parseFenString(fen: string): Game {
    const board = new Chess(fen);

    return {
        initialPosition: board.fen(),
        pgn: board.pgn(),
        players: {
            white: {
                username: "White",
                result: GameResult.UNKNOWN
            },
            black: {
                username: "Black",
                result: GameResult.UNKNOWN
            }
        },
        variant: Variant.STANDARD
    };
}

export default parseFenString;