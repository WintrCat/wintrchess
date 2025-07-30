import React from "react";

import { stringifyEvaluation } from "shared/lib/utils/chess";
import { classificationImages } from "@analysis/constants/classifications";

import EvaluationGraphPoint from "./Point";
import * as styles from "./EvaluationGraph.module.css";

interface TooltipRendererProps {
    dataPoint: EvaluationGraphPoint;
}

function TooltipRenderer({ dataPoint }: TooltipRendererProps) {
    return <div className={styles.tooltip}>
        <div className={styles.tooltipEvaluation}>
            {dataPoint.state.classification
                && <img
                    src={classificationImages[dataPoint.state.classification]}
                    height={25}
                />
            }

            <span>
                {stringifyEvaluation(dataPoint.evaluation, true)}
            </span>
        </div>

        {dataPoint.state.move?.san
            && <span className={styles.tooltipMove}>
                {dataPoint.state.move?.san}
            </span>
        }
    </div>;
}

export default TooltipRenderer;