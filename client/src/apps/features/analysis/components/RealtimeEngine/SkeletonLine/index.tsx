import React from "react";

import * as styles from "./SkeletonLine.module.css";

function SkeletonLine() {
    return <div className={styles.skeletonLine}>
        <div className={`${styles.evaluation} ${styles.pulsing}`} />

        <div className={`${styles.lineMoves} ${styles.pulsing}`} />
    </div>;
}

export default SkeletonLine;