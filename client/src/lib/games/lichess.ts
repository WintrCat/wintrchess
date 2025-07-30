import { StatusCodes } from "http-status-codes";

import Game from "shared/types/game/Game";
import { GameResult } from "shared/constants/game/GameResult";
import { PieceColour, flipPieceColour } from "shared/constants/PieceColour";
import TimeControl from "shared/constants/game/TimeControl";
import Variant from "shared/constants/game/Variant";
import { getMonthLength, padDateNumber } from "shared/lib/utils/date";
import { STARTING_FEN } from "shared/constants/utils";
import APIResponse from "@/types/APIResponse";

// Map from lichess winner colours to ours
const winnerColourCodes: Record<string, PieceColour | undefined> = {
    white: PieceColour.WHITE,
    black: PieceColour.BLACK
};

// Map from lichess time controls to ours
const timeControlCodes: Record<string, TimeControl | undefined> = {
    ultraBullet: TimeControl.BULLET,
    bullet: TimeControl.BULLET,
    blitz: TimeControl.BLITZ,
    rapid: TimeControl.RAPID,
    classical: TimeControl.CLASSICAL,
    correspondence: TimeControl.CORRESPONDENCE
};

// Map from lichess variants to ours
const variantCodes: Record<string, Variant | undefined> = {
    standard: Variant.STANDARD,
    chess960: Variant.CHESS960
};

async function getLichessGames(
    username: string,
    month: number,
    year: number
): APIResponse<{ games: Game[] }> {
    const monthStart = new Date(
        `${year}-${padDateNumber(month)}-01T00:00:00.000Z`
    );

    const monthEnd = new Date(
        `${year}-${padDateNumber(month)}-${getMonthLength(month)}`
        + "T23:59:59.999Z"
    );

    const gamesResponse = await fetch(
        `https://lichess.org/api/games/user/${username}`
        + `?since=${monthStart.getTime()}`
        + `&until=${monthEnd.getTime()}`
        + "&pgnInJson=true",
        { headers: { Accept: "application/x-ndjson" } }
    );

    if (!gamesResponse.ok) return { status: gamesResponse.status };

    // Games are received in ND-JSON format
    // Last empty line is filtered out and JSON strings are parsed
    const undelimitedGames = await gamesResponse.text();
    const games = undelimitedGames
        .split("\n")
        .filter(game => game.length > 0)
        .map(game => JSON.parse(game));

    const parsedGames = games.map(game => {
        const results = {
            [PieceColour.WHITE]: GameResult.DRAW,
            [PieceColour.BLACK]: GameResult.DRAW
        };

        // If there's a winner, set result to LOSE for opposite colour
        const winner = winnerColourCodes[game.winner];
        if (winner) {
            results[winner] = GameResult.WIN;
            results[flipPieceColour(winner)] = GameResult.LOSE;
        }

        const whiteUsername = game.players.white.aiLevel
            ? `AI Level ${game.players.white.aiLevel}`
            : game.players.white.user?.name;

        const blackUsername = game.players.black.aiLevel
            ? `AI Level ${game.players.black.aiLevel}`
            : game.players.black.user?.name;

        return {
            pgn: game.pgn,
            initialPosition: game.initialFen || STARTING_FEN,
            timeControl: (
                timeControlCodes[game.speed]
                || TimeControl.CORRESPONDENCE
            ),
            variant: variantCodes[game.variant] || Variant.STANDARD,
            players: {
                white: {
                    username: whiteUsername,
                    rating: game.players.white.rating,
                    title: game.players.white.user?.title,
                    result: results[PieceColour.WHITE]
                },
                black: {
                    username: blackUsername,
                    rating: game.players.black.rating,
                    title: game.players.black.user?.title,
                    result: results[PieceColour.BLACK]
                }
            },
            date: new Date(game.lastMoveAt).toISOString()
        } as Game;
    });

    return {
        status: StatusCodes.OK,
        games: parsedGames
    };
}

export default getLichessGames;