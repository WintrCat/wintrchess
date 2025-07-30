import PieceColour from "../PieceColour";

export enum GameResult {
    WIN = "win",
    DRAW = "draw",
    LOSE = "lose",
    UNKNOWN = "unknown"
}

export function getOpinionatedGameResult(
    whiteResult: GameResult,
    perspective: PieceColour
) {
    if (perspective == PieceColour.BLACK) {
        return {
            [GameResult.WIN]: GameResult.LOSE,
            [GameResult.DRAW]: GameResult.DRAW,
            [GameResult.LOSE]: GameResult.WIN,
            [GameResult.UNKNOWN]: GameResult.UNKNOWN
        }[whiteResult];
    }

    return whiteResult;
}

export default GameResult;