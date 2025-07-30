import { sum, round } from "lodash-es";

import AnalysedGame from "shared/types/game/AnalysedGame";
import EngineVersion from "shared/constants/EngineVersion";
import { StateTreeNode, getNodeChain } from "shared/types/game/position/StateTreeNode";
import { getTopEngineLine } from "shared/types/game/position/EngineLine";
import Engine from "@analysis/lib/engine";
import getCloudEvaluation from "./cloudEvaluate";

interface EvaluateMovesOptions {
    engineVersion: EngineVersion;
    maxEngineCount?: number;
    engineDepth: number;
    engineTimeLimit?: number;
    cloudEngineLines: number;
    engineConfig?: (engine: Engine) => void;
    onProgress?: (progress: number) => void;
    verbose?: boolean;
}

/**
 * @throws {EvaluateMovesError}
 */
async function evaluateMoves(
    game: AnalysedGame,
    options: EvaluateMovesOptions
): Promise<StateTreeNode[]> {
    const stateTreeNodes = getNodeChain(game.stateTree);

    // Each state tree node keeps a progress from 0 to 1
    const progresses: number[] = [];

    function getProgress() {
        return round(sum(progresses) / stateTreeNodes.length, 3);
    }

    // Apply cloud evaluations where possible
    for (const stateTreeNode of stateTreeNodes) {
        try {
            var cloudEngineLines = await getCloudEvaluation(
                stateTreeNode.state.fen, options.cloudEngineLines
            );
        } catch {
            break;
        }

        const topCloudLine = getTopEngineLine(cloudEngineLines);
        if (!topCloudLine) break;

        if (topCloudLine.depth < options.engineDepth) break;
        if (cloudEngineLines.length < options.cloudEngineLines) break;

        stateTreeNode.state.engineLines = [
            ...stateTreeNode.state.engineLines,
            ...cloudEngineLines
        ];

        progresses.push(1);
        options.onProgress?.(getProgress());
    }

    // Locally evaluate remaining positions

    // Maximum engine count or however many are needed for each
    // remaining position, add 1 for cutoff for last cloud evaluated state
    const evaluatedStateCount = stateTreeNodes.filter(
        node => node.state.engineLines.some(
            line => line.source == EngineVersion.LICHESS_CLOUD
        )
    ).length;

    const engineCount = Math.min(
        options.maxEngineCount || 1,
        (stateTreeNodes.length - evaluatedStateCount) + 1
    );

    return new Promise((res, rej) => {
        let enginesResting = 0;
        let stateTreeNodeIndex = Math.max(evaluatedStateCount - 1, 0);

        // Bring an engine to a new FEN
        function evaluateNextPosition(engine: Engine) {
            const currentStateTreeNodeIndex = stateTreeNodeIndex;
            const currentStateTreeNode = stateTreeNodes[stateTreeNodeIndex];

            if (stateTreeNodeIndex >= stateTreeNodes.length) {
                engine.terminate();

                if (++enginesResting == engineCount)
                    res(stateTreeNodes);

                return;
            }

            engine.setPosition(game.initialPosition, stateTreeNodes
                .slice(0, stateTreeNodeIndex + 1)
                .filter(node => node.state.move)
                .map(node => node.state.move!.uci)
            );

            engine.evaluate({
                depth: options.engineDepth,
                timeLimit: options.engineTimeLimit
                    ? options.engineTimeLimit * 1000
                    : undefined,
                onEngineLine: line => {
                    // Depth 0 is given for states with no legal moves
                    const localProgress = line.depth == 0
                        ? 1 : line.depth / options.engineDepth;
                    
                    // Progress value will already exist for cutoff node
                    progresses[currentStateTreeNodeIndex] = Math.max(
                        progresses[currentStateTreeNodeIndex] || 0,
                        localProgress
                    );

                    options.onProgress?.(getProgress());
                }
            }).then(lines => {
                progresses[currentStateTreeNodeIndex] = 1;

                currentStateTreeNode.state.engineLines = [
                    ...currentStateTreeNode.state.engineLines,
                    ...lines
                ];

                evaluateNextPosition(engine);
            });

            stateTreeNodeIndex++;
        }

        // Start engines on first positions
        for (let i = 0; i < engineCount; i++) {
            const engine = new Engine(options.engineVersion);

            options.engineConfig?.(engine);

            if (options.verbose) {
                engine.onMessage(console.log);
            }

            engine.onError(rej);

            evaluateNextPosition(engine);
        }
    });
}

export default evaluateMoves;