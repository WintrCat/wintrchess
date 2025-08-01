import { GameAnalysis } from "@/types/game/GameAnalysis";
import { StateTreeNode, getNodeChain } from "@/types/game/position/StateTreeNode";
import AnalysisOptions from "./types/AnalysisOptions";
import { adaptPieceColour } from "@/constants/PieceColour";
import {
    extractCurrentStateTreeNode,
    extractPreviousStateTreeNode
} from "./utils/extractNode";
import { getOpeningName } from "./utils/opening";
import { getMoveAccuracy } from "./accuracy";
import { classify } from "./classify";

export function getGameAnalysis(
    rootNode: StateTreeNode,
    options?: AnalysisOptions
): GameAnalysis {
    const treeNodes = getNodeChain(rootNode);
    
    for (const node of treeNodes) {
        try {
            node.state.classification = classify(node, options);
        } catch (err) {
            node.state.classification = undefined;
        }

        node.state.opening = getOpeningName(node.state.fen);

        if (!node.parent) continue;

        const previous = extractPreviousStateTreeNode(node.parent);
        const current = extractCurrentStateTreeNode(node);

        if (!previous || !current) continue;

        node.state.accuracy = getMoveAccuracy(
            previous.evaluation,
            current.evaluation,
            adaptPieceColour(current.playedMove.color)
        );
    }

    return {
        estimatedRatings: {
            white: 2000,
            black: 1000
        },
        stateTree: rootNode
    };
}