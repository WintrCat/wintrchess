import { useState, useEffect } from "react";
import { StatusCodes } from "http-status-codes";

import { useAltcha } from "@/apps/features/analysis/hooks/useAltcha";
import AnalysisStatus from "@analysis/constants/AnalysisStatus";
import useSettingsStore from "@/stores/SettingsStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import useAnalysisProgressStore from "@analysis/stores/AnalysisProgressStore";
import useAnalysisSessionStore from "@analysis/stores/AnalysisSessionStore";
import { analyseNode } from "@analysis/lib/reporter";

function useRealtimeAnalyser() {
    const executeCaptcha = useAltcha();

    const settings = useSettingsStore(state => state.settings.analysis);

    const {
        analysisSessionToken,
        analysisCaptchaError
    } = useAnalysisSessionStore();

    const {
        currentStateTreeNode,
        dispatchCurrentNodeUpdate
    } = useAnalysisBoardStore();

    const setRealtimeClassifyError = useAnalysisProgressStore(
        state => state.setRealtimeClassifyError
    );

    const [
        classifyStatus,
        setClassifyStatus
    ] = useState(AnalysisStatus.INACTIVE);

    function cancelAnalyse(errorString?: string) {
        setClassifyStatus(AnalysisStatus.INACTIVE);
        setRealtimeClassifyError(errorString);
    }

    // Reattempt classification when CAPTCHA token updates
    useEffect(() => {
        if (classifyStatus != AnalysisStatus.AWAITING_CAPTCHA) return;

        if (analysisCaptchaError) {
            return cancelAnalyse(analysisCaptchaError);
        }

        considerRealtimeAnalyse();
    }, [
        classifyStatus,
        analysisSessionToken,
        analysisCaptchaError
    ]);

    async function considerRealtimeAnalyse() {
        if (!currentStateTreeNode.parent) return;

        // If there is not enough data for a centipawn comparison
        const parentState = currentStateTreeNode.parent.state;

        if (parentState.engineLines.length == 0) {
            if (!currentStateTreeNode.state.classification) return;

            return cancelAnalyse("classifiedMoveCard.insufficientLines");
        }

        const analyseNodeResult = await analyseNode(currentStateTreeNode, {
            includeBrilliant: settings.classifications.included.brilliant,
            includeTheory: settings.classifications.included.theory
        });

        // If session is invalid, await a new CAPTCHA solve
        if (analyseNodeResult.status == StatusCodes.UNAUTHORIZED) {
            executeCaptcha();
            setClassifyStatus(AnalysisStatus.AWAITING_CAPTCHA);

            return;
        }

        if (!analyseNodeResult.node)
            return cancelAnalyse("classifiedMoveCard.unknownError");

        // Apply classification and deactivate classifier
        const currentState = currentStateTreeNode.state;
        const analysedState = analyseNodeResult.node.state;

        currentState.classification = analysedState.classification;
        currentState.accuracy = analysedState.accuracy;
        currentState.opening = analysedState.opening;

        if (!analysedState.classification)
            return cancelAnalyse("classifiedMoveCard.unknownError");

        cancelAnalyse();
        dispatchCurrentNodeUpdate();
    }

    return considerRealtimeAnalyse;
}

export default useRealtimeAnalyser;