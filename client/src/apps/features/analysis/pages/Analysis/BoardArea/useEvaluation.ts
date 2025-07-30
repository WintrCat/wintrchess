import { useEffect, useState } from "react";

import { defaultEvaluation } from "shared/constants/utils";
import useAnalysisGameStore from "@analysis/stores/AnalysisGameStore";
import useRealtimeEngineStore from "@analysis/stores/RealtimeEngineStore";
import useSettingsStore from "@/stores/SettingsStore";

function useEvaluation() {
    const engineEnabled = useSettingsStore(
        state => state.settings.analysis.engine.enabled
    );

    const gameAnalysisOpen = useAnalysisGameStore(
        state => state.gameAnalysisOpen
    );

    const { displayedEngineLines } = useRealtimeEngineStore();

    const [ evaluation, setEvaluation ] = useState(defaultEvaluation);

    useEffect(() => {
        const evaluation = displayedEngineLines.at(0)?.evaluation;

        if (evaluation) return setEvaluation(evaluation);

        if (!gameAnalysisOpen) setEvaluation(defaultEvaluation);
    }, [displayedEngineLines]);

    return engineEnabled ? evaluation : undefined;
}

export default useEvaluation;