import { useTranslation } from "react-i18next";

import AnalysedGame from "shared/types/game/AnalysedGame";
import AnalysisStatus from "@analysis/constants/AnalysisStatus";
import useSettingsStore from "@/stores/SettingsStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import useAnalysisProgressStore from "@analysis/stores/AnalysisProgressStore";
import evaluateMoves from "@analysis/lib/evaluate";

function useEvaluateGame() {
    const { t } = useTranslation("analysis");

    const settings = useSettingsStore(
        state => state.settings.analysis.engine
    );

    const dispatchCurrentNodeUpdate = useAnalysisBoardStore(
        state => state.dispatchCurrentNodeUpdate
    );

    const {
        setAnalysisStatus,
        setEvaluationProgress,
        setAnalysisError
    } = useAnalysisProgressStore();

    async function evaluateGame(analysisGame: AnalysedGame) {
        setAnalysisStatus(AnalysisStatus.EVALUATING);

        try {
            await evaluateMoves(analysisGame, {
                engineVersion: settings.version,
                engineDepth: settings.depth,
                engineTimeLimit: settings.timeLimitEnabled
                    ? settings.timeLimit : undefined,
                cloudEngineLines: settings.lines,
                maxEngineCount: 4,
                engineConfig: engine => engine.setLineCount(settings.lines),
                onProgress: progress => {
                    setEvaluationProgress(progress);
                    dispatchCurrentNodeUpdate();
                }
            });

            setAnalysisStatus(AnalysisStatus.AWAITING_CAPTCHA);
        } catch (err) {
            console.error(err);
            setAnalysisError(t("analysisError"));
        }
    }

    return evaluateGame;
}

export default useEvaluateGame;