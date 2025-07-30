import { StatusCodes } from "http-status-codes";

import Game from "shared/types/game/Game";
import { GameResult } from "shared/constants/game/GameResult";
import TimeControl from "shared/constants/game/TimeControl";
import Variant from "shared/constants/game/Variant";
import { padDateNumber } from "shared/lib/utils/date";
import { STARTING_FEN } from "shared/constants/utils";
import APIResponse from "@/types/APIResponse";

// Map from chess.com time controls to ours
const timeControlCodes: Record<string, TimeControl | undefined> = {
    bullet: TimeControl.BULLET,
    blitz: TimeControl.BLITZ,
    rapid: TimeControl.RAPID,
    daily: TimeControl.CORRESPONDENCE
};

// Map from chess.com variants to ours
const variantCodes: Record<string, Variant | undefined> = {
    chess: Variant.STANDARD,
    chess960: Variant.CHESS960
};

// Map from chess.com game results to ours
const gameResultCodes: Record<string, GameResult | undefined> = {
    win: GameResult.WIN,
    checkmated: GameResult.LOSE,
    agreed: GameResult.DRAW,
    repetition: GameResult.DRAW,
    timeout: GameResult.LOSE,
    resigned: GameResult.LOSE,
    stalemate: GameResult.DRAW,
    lose: GameResult.LOSE,
    insufficient: GameResult.DRAW,
    "50move": GameResult.DRAW,
    abandoned: GameResult.LOSE,
    timevsinsufficient: GameResult.DRAW
};

const futureFetchError = "Date cannot be set in the future";

async function getChessComGames(
    username: string,
    month: number,
    year: number
): APIResponse<{ games: Game[] }> {
    const gamesResponse = await fetch(
        `https://api.chess.com/pub/player/${username}`
        + `/games/${year}/${padDateNumber(month)}`
    );

    if (gamesResponse.status == StatusCodes.NOT_FOUND) {
        try {
            const error = await gamesResponse.json();

            if (error.message == futureFetchError)
                return { status: StatusCodes.OK, games: [] };
        } catch {
            return { status: StatusCodes.INTERNAL_SERVER_ERROR };
        }
    } else if (!gamesResponse.ok) {
        return { status: gamesResponse.status };
    }

    const games: any[] | undefined = (await gamesResponse.json()).games;
    
    if (!games) return { status: StatusCodes.OK, games: [] };

    const parsedGames: Game[] = games
        .reverse()
        .filter(game => Object
            .keys(variantCodes)
            .includes(game.rules)
        )
        .map(game => ({
            pgn: game.pgn,
            timeControl: (
                timeControlCodes[game["time_class"]]
                || TimeControl.CORRESPONDENCE
            ),
            variant: variantCodes[game.rules] || Variant.STANDARD,
            initialPosition: game["initial_setup"] || STARTING_FEN,
            players: {
                white: {
                    username: game.white.username,
                    rating: game.white.rating,
                    result: gameResultCodes[game.white.result] || GameResult.UNKNOWN
                },
                black: {
                    username: game.black.username,
                    rating: game.black.rating,
                    result: gameResultCodes[game.black.result] || GameResult.UNKNOWN
                }
            },
            date: new Date(game["end_time"] * 1000).toISOString()
        }));

    return {
        status: StatusCodes.OK,
        games: parsedGames
    };
}

export default getChessComGames;