import React, { useMemo } from "react";
import { clamp } from "lodash-es";

import PieceColour from "shared/constants/PieceColour";
import { stringifyEvaluation } from "shared/lib/utils/chess";

import EvaluationBarProps from "./EvaluationBarProps";
import * as styles from "./EvaluationBar.module.css";

function EvaluationBar({
    className,
    style,
    evaluation,
    moveColour,
    flipped = false
}: EvaluationBarProps) {
    const evaluationText = useMemo(() => (
        stringifyEvaluation({
            ...evaluation,
            value: Math.abs(evaluation.value)
        }, false, 1)
    ), [evaluation]);

    const overBarHeight = useMemo(() => {
        if (evaluation.type == "centipawn") {
            return clamp(
                50 - (evaluation.value / 20),
                5, 95
            );
        } else {
            return evaluation.value == 0
                ? (moveColour == PieceColour.WHITE ? 0 : 100)
                : (evaluation.value > 0 ? 0 : 100);
        }
    }, [evaluation]);

    const textBottom = overBarHeight > 50 == flipped;

    return <div
        className={`${styles.evaluationBar} ${className}`}
        style={{
            backgroundColor: flipped ? "#0c0c0c" : "#fff",
            ...style
        }}
    >
        <div
            className={styles.overBar}
            style={{
                backgroundColor: flipped ? "#fff" : "#0c0c0c",
                height: flipped
                    ? `calc(100% - ${overBarHeight}%)`
                    : `${overBarHeight}%`
            }}
        />

        <span
            className={styles.evaluationText}
            style={{
                [textBottom ? "bottom" : "top"]: "7px",
                color: overBarHeight > 50 ? "#fff" : "#000"
            }}
        >
            {evaluationText}
        </span>
    </div>;
}

export default EvaluationBar;