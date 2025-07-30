import { useTranslation } from "react-i18next";
import { StatusCodes } from "http-status-codes";

import { findNodeRecursively } from "shared/types/game/position/StateTreeNode";
import AnalysisStatus from "@analysis/constants/AnalysisStatus";
import { useAltcha } from "@/apps/features/analysis/hooks/useAltcha";
import useSettingsStore from "@/stores/SettingsStore";
import useAnalysisGameStore from "@analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import useAnalysisProgressStore from "@analysis/stores/AnalysisProgressStore";
import { analyseStateTree } from "@analysis/lib/reporter";

function useAnalyseGame(
    onAnalysisError?: (message: string) => void
) {
    const { t } = useTranslation("analysis");

    const settings = useSettingsStore(state => state.settings.analysis);

    const {
        analysisGame,
        setAnalysisGame
    } = useAnalysisGameStore();

    const setCurrentStateTreeNode = useAnalysisBoardStore(
        state => state.setCurrentStateTreeNode
    );

    const setAnalysisStatus = useAnalysisProgressStore(
        state => state.setAnalysisStatus
    );

    const executeCaptcha = useAltcha();

    return async () => {
        const analyseResult = await analyseStateTree(analysisGame.stateTree, {
            includeBrilliant: settings.classifications.included.brilliant,
            includeCritical: settings.classifications.included.critical,
            includeTheory: settings.classifications.included.theory
        });

        // For any errors, display message or reset CAPTCHA
        if (analyseResult.status == StatusCodes.UNAUTHORIZED) {
            return executeCaptcha();
        } else if (analyseResult.status != StatusCodes.OK) {
            return onAnalysisError?.(
                t("progressReporter.reportFailed")
            );
        }

        if (!analyseResult.gameAnalysis) {
            return setAnalysisStatus(AnalysisStatus.INACTIVE);
        }

        // Update analysed game with new analysis object
        setAnalysisGame({
            ...analysisGame,
            ...analyseResult.gameAnalysis
        });

        // Set current state tree node to equivalent in new tree
        setCurrentStateTreeNode(prev => {
            if (!analyseResult.gameAnalysis) {
                return prev;
            }

            return findNodeRecursively(
                analyseResult.gameAnalysis.stateTree,
                node => node.id == prev.id
            ) || prev;
        });

        setAnalysisStatus(AnalysisStatus.INACTIVE);
    };
}

export default useAnalyseGame;