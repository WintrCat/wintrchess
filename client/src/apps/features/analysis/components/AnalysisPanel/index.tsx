import React, { lazy } from "react";
import { useTranslation } from "react-i18next";

import AnalysisTab from "@analysis/constants/AnalysisTab";
import useSettingsStore from "@/stores/SettingsStore";
import useAnalysisGameStore from "@analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import useAnalysisTabStore from "@analysis/stores/AnalysisTabStore";
import ClassifiedMoveCard from "@analysis/components/report/ClassifiedMoveCard";
import StateTreeTraverser from "@/components/chess/StateTreeTraverser";

import TabBar from "./TabBar";
import AnalysisProgress from "./AnalysisProgress";
import RealtimeEngineArea from "./RealtimeEngineArea";

import GameSelection from "./GameSelection";
import GameReport from "./GameReport";
import GameAnalysis from "./GameAnalysis";

import AnalysisPanelProps from "./AnalysisPanelProps";
import * as styles from "./AnalysisPanel.module.css";

const OptionsToolbar = lazy(() => import("@analysis/components/OptionsToolbar"));

function AnalysisPanel({
    className,
    style
}: AnalysisPanelProps) {
    const { t } = useTranslation("analysis");

    const settings = useSettingsStore(state => state.settings.analysis);

    const gameAnalysisOpen = useAnalysisGameStore(
        state => state.gameAnalysisOpen
    );

    const currentNode = useAnalysisBoardStore(
        state => state.currentStateTreeNode
    );

    const { activeTab } = useAnalysisTabStore();
    
    return <div
        className={`${styles.wrapper} ${className}`}
        style={style}
    >
        <div className={styles.components}>
            <div className={styles.title}>
                {t("title")}
            </div>

            <OptionsToolbar/>

            {gameAnalysisOpen && <TabBar/>}

            <AnalysisProgress/>

            {(gameAnalysisOpen && settings.engine.enabled)
                && <RealtimeEngineArea/>
            }

            {gameAnalysisOpen
                && currentNode.state.move
                && !settings.classifications.hide
                && (
                    settings.engine.enabled
                    || currentNode.state.classification
                )
                && <ClassifiedMoveCard/>
            }

            {gameAnalysisOpen
                ? (activeTab == AnalysisTab.REPORT
                    ? <GameReport/>
                    : <GameAnalysis/>
                )
                : <GameSelection/>
            }
        </div>

        <div className={styles.traverserContainer}>
            <StateTreeTraverser className={styles.traverser} />
        </div>
    </div>;
}

export default AnalysisPanel;