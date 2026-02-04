import React from "react";
import { sumBy } from "lodash-es";

import { getGameAccuracy } from "shared/lib/reporter/accuracy";
import { Classification } from "shared/constants/Classification";
import PieceColour from "shared/constants/PieceColour";
import { getNodeChain } from "shared/types/game/position/StateTreeNode";
import useAnalysisGameStore from "@analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import AccuraciesCard from "@analysis/components/report/AccuraciesCard";
import ClassificationCountCard from "@analysis/components/report/ClassificationCountCard";
import GameRatingCard from "@/components/GameRatingCard";
import { type GameQualityCounts } from "@/lib/gameRating";

import EvaluationGraphArea from "./EvaluationGraphArea";

function GameReport() {
    const analysisGame = useAnalysisGameStore(state => state.analysisGame);

    useAnalysisBoardStore(state => state.currentStateTreeNodeUpdate);

    const accuracies = getGameAccuracy(analysisGame.stateTree);
    const nodeChain = getNodeChain(analysisGame.stateTree);

    // Helper function to get classification counts for a color
    function getClassificationCount(colour: PieceColour, classification: Classification): number {
        return sumBy(
            nodeChain,
            node => Number(
                node.state.moveColour == colour
                && node.state.classification == classification
            )
        );
    }

    // Helper function to get total moves for a color
    function getTotalMoves(colour: PieceColour): number {
        return sumBy(
            nodeChain,
            node => Number(node.state.moveColour == colour)
        );
    }

    // Extract data for Game Rating
    const whiteCounts: GameQualityCounts = {
        inaccuracy: getClassificationCount(PieceColour.WHITE, Classification.INACCURACY),
        mistake: getClassificationCount(PieceColour.WHITE, Classification.MISTAKE),
        blunder: getClassificationCount(PieceColour.WHITE, Classification.BLUNDER),
        theory: getClassificationCount(PieceColour.WHITE, Classification.THEORY),
        total: getTotalMoves(PieceColour.WHITE)
    };

    const blackCounts: GameQualityCounts = {
        inaccuracy: getClassificationCount(PieceColour.BLACK, Classification.INACCURACY),
        mistake: getClassificationCount(PieceColour.BLACK, Classification.MISTAKE),
        blunder: getClassificationCount(PieceColour.BLACK, Classification.BLUNDER),
        theory: getClassificationCount(PieceColour.BLACK, Classification.THEORY),
        total: getTotalMoves(PieceColour.BLACK)
    };
    
    return <>
        <EvaluationGraphArea/>

        <AccuraciesCard accuracies={accuracies} />

        <GameRatingCard
            white={{ 
                accuracyPct: accuracies.white || 0, 
                counts: whiteCounts 
            }}
            black={{ 
                accuracyPct: accuracies.black || 0, 
                counts: blackCounts 
            }}
        />

        <ClassificationCountCard analysisGame={analysisGame} />
    </>;
}

export default GameReport;