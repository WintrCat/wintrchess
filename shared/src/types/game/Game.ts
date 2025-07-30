import z from "zod";
import { validateFen } from "chess.js";

import TimeControl from "@/constants/game/TimeControl";
import Variant from "@/constants/game/Variant";
import PieceColour from "@/constants/PieceColour";
import { gamePlayerProfileSchema } from "./GamePlayerProfile";

export function getColourPlayed(game: Game, username: string) {
    return (
        game.players.white.username?.toLowerCase()
        == username.toLowerCase()
    ) ? PieceColour.WHITE : PieceColour.BLACK;
}

export const gameSchema = z.object({
    pgn: z.string(),
    initialPosition: z.string().refine(
        pos => validateFen(pos).ok
    ),
    timeControl: z.enum(TimeControl).optional(),
    variant: z.enum(Variant),
    players: z.object({
        white: gamePlayerProfileSchema,
        black: gamePlayerProfileSchema
    }),
    date: z.iso.datetime().optional()
});

export type Game = z.infer<typeof gameSchema>;

export default Game;