import { Chess } from "chess.js";
import { components } from "@lichess-org/types";

import { EngineLine } from "shared/types/game/position/EngineLine";
import Move from "shared/types/game/position/Move";
import EngineVersion from "shared/constants/EngineVersion";
import { lichessCastlingMoves } from "shared/constants/utils";

type CloudEvaluation = components["schemas"]["CloudEval"];

async function getCloudEvaluation(fen: string, targetCount = 1) {
    const cloudResponse = await fetch(
        "https://lichess.org/api/cloud-eval"
        + `?fen=${fen}&multiPv=${targetCount}`
    );

    if (!cloudResponse.ok) {
        throw Error(`cloud evaluation failed (${cloudResponse.status})`);
    }

    const cloudEvaluation: CloudEvaluation = await cloudResponse.json();

    const engineLines: EngineLine[] = [];

    for (const variation of cloudEvaluation.pvs) {
        const variationBoard = new Chess(fen);

        const lineMoves: Move[] = [];

        for (const lichessUciMove of variation.moves.split(" ")) {
            const uciMove = lichessCastlingMoves[lichessUciMove]
                || lichessUciMove;

            try {
                const parsedMove = variationBoard.move(uciMove);

                lineMoves.push({
                    san: parsedMove.san,
                    uci: parsedMove.lan
                });
            } catch {
                break;
            }
        }

        engineLines.push({
            evaluation: {
                type: ("mate" in variation) ? "mate" : "centipawn",
                value: ("mate" in variation) ? variation.mate : variation.cp
            },
            source: EngineVersion.LICHESS_CLOUD,
            depth: cloudEvaluation.depth,
            index: cloudEvaluation.pvs.indexOf(variation) + 1,
            moves: lineMoves
        });
    }

    return engineLines;
}

export default getCloudEvaluation;