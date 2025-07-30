import React, { useMemo } from "react";
import { Tooltip } from "react-tooltip";
import { uniqueId } from "lodash-es";

import BoardColourPresetProps from "./BoardColourPresetProps";
import * as styles from "./BoardColourPreset.module.css";

import iconPiecesStandardBlack_king from "@assets/img/pieces/standard/black_king.svg";
import iconPiecesStandardWhite_king from "@assets/img/pieces/standard/white_king.svg";

function BoardColourPreset({
    lightSquareColour,
    darkSquareColour,
    title,
    selected,
    onClick
}: BoardColourPresetProps) {
    const tooltipId = useMemo(uniqueId, []);

    return <>
        <div
            className={styles.wrapper}
            style={{ border: selected
                ? "2px solid var(--ui-blue)"
                : undefined
            }}
            data-tooltip-id={tooltipId}
            onClick={onClick}
        >
            <div style={{ backgroundColor: lightSquareColour }}>
                <img
                    src={iconPiecesStandardBlack_king}
                    style={{ width: "100%" }}
                />
            </div>

            <div style={{ backgroundColor: darkSquareColour }} />

            <div style={{ backgroundColor: darkSquareColour }} />

            <div style={{ backgroundColor: lightSquareColour }}>
                <img
                    src={iconPiecesStandardWhite_king}
                    style={{ width: "100%" }}
                />
            </div>
        </div>

        <Tooltip id={tooltipId} content={title} />
    </>;
}

export default BoardColourPreset;