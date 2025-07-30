import React from "react";

import ads from "@/constants/advertisements";
import Advertisement from "@/components/Advertisement";
import useGameLoader from "@analysis/hooks/useGameLoader";
import AnalysisPanel from "@analysis/components/AnalysisPanel";

import BoardArea from "./BoardArea";
import * as styles from "./Analysis.module.css";

function Analysis() {
    useGameLoader();

    return <div className={styles.wrapper}>
        <div className={styles.advertisement}>
            <Advertisement adUnitId={ads.analysis.top} style={{
                width: "100%", height: "100px"
            }}/>
        </div>

        <div className={styles.analysisSection}>
            <BoardArea/>

            <AnalysisPanel className={styles.panel} />
        </div>

        <div className={styles.advertisement}>
            <Advertisement adUnitId={ads.analysis.bottom} style={{
                width: "100%", height: "100px"
            }}/>
        </div>
    </div>;
}

export default Analysis;