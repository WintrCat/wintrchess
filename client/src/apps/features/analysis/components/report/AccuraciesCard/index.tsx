import React from "react";
import { useTranslation } from "react-i18next";

import AccuraciesCardProps from "./AccuraciesCardProps";
import * as styles from "./AccuraciesCard.module.css";

function AccuraciesCard({ accuracies }: AccuraciesCardProps) {
    const { t } = useTranslation("analysis");

    return <div className={styles.wrapper}>
        <div className={styles.accuraciesTitle}>
            {t("accuraciesCard.title")}
        </div>

        <div className={styles.accuracies}>
            <div className={`${styles.accuracy} ${styles.whiteAccuracy}`}>
                {accuracies.white
                    ? accuracies.white.toFixed(1) + "%"
                    : "N/A"
                }
            </div>

            <div className={`${styles.accuracy} ${styles.blackAccuracy}`}>
                {accuracies.black
                    ? accuracies.black.toFixed(1) + "%"
                    : "N/A"
                }
            </div>
        </div>
    </div>;
}

export default AccuraciesCard;