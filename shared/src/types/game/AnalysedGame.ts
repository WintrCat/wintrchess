import z from "zod";

import { Game, gameSchema } from "./Game";
import { gameAnalysisSchema, SerializedGameAnalysis } from "./GameAnalysis";

export const analysedGameSchema = gameSchema.extend(gameAnalysisSchema.shape);

export type AnalysedGame = z.infer<typeof analysedGameSchema>;

export type SerializedAnalysedGame = Game & SerializedGameAnalysis;

export default AnalysedGame;