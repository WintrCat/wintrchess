import React, { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { findIndex } from "lodash-es";

import { getNodeChain } from "shared/types/game/position/StateTreeNode";
import useAnalysisGameStore from "@analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import EvaluationGraph from "@analysis/components/report/EvaluationGraph";
import playBoardSound from "@/lib/boardSounds";

function EvaluationGraphArea() {
    const analysisGame = useAnalysisGameStore(state => state.analysisGame);

    const {
        currentStateTreeNodeUpdate,
        currentStateTreeNode,
        setCurrentStateTreeNode
    } = useAnalysisBoardStore(
        useShallow(state => ({
            currentStateTreeNodeUpdate: state.currentStateTreeNodeUpdate,
            currentStateTreeNode: state.currentStateTreeNode,
            setCurrentStateTreeNode: state.setCurrentStateTreeNode
        }))
    );

    const mainlineChain = useMemo(() => (
        getNodeChain(analysisGame.stateTree)
    ), [analysisGame, currentStateTreeNodeUpdate]);

    return <EvaluationGraph
        nodes={mainlineChain}
        selectedIndex={findIndex(
            mainlineChain,
            node => node.id == currentStateTreeNode.id
        )}
        onPointClick={point => {
            const clickedNode = mainlineChain.find(
                node => node.id == point.nodeId
            );
            if (!clickedNode) return;

            setCurrentStateTreeNode(clickedNode);
            playBoardSound(clickedNode);
        }}
    />;
}

export default EvaluationGraphArea;