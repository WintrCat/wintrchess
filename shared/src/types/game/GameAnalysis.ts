import z from "zod";

import {
    SerializedStateTreeNode,
    stateTreeNodeSchema
} from "./position/StateTreeNode";

export const gameAnalysisSchema = z.object({
    estimatedRatings: z.object({
        white: z.number(),
        black: z.number()
    }).optional(),
    stateTree: stateTreeNodeSchema
});

export type GameAnalysis = z.infer<typeof gameAnalysisSchema>;

export type SerializedGameAnalysis = (
    Omit<GameAnalysis, "stateTree">
    & { stateTree: SerializedStateTreeNode }
);

export default GameAnalysis;