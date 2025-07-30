import React from "react";
import { useTranslation } from "react-i18next";
import { sumBy } from "lodash-es";

import { Classification } from "shared/constants/Classification";
import PieceColour from "shared/constants/PieceColour";
import {
    StateTreeNode,
    getNodeChain
} from "shared/types/game/position/StateTreeNode";
import {
    classificationImages,
    classificationNames,
    classificationColours
} from "@analysis/constants/classifications";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";

import ClassificationCountCardProps from "./ClassificationCountCardProps";
import * as styles from "./ClassificationCountCard.module.css";

const excludedClassifications = [
    Classification.FORCED,
    Classification.RISKY
];

function ClassificationCountCard({ analysisGame }: ClassificationCountCardProps) {
    const { t } = useTranslation("analysis");

    useAnalysisBoardStore(state => state.currentStateTreeNodeUpdate);

    const nodeChain = getNodeChain(analysisGame.stateTree);

    function getClassificationCount(
        chain: StateTreeNode[],
        colour: PieceColour,
        classification: Classification
    ) {
        return sumBy(
            chain,
            node => Number(
                node.state.moveColour == colour
                && node.state.classification == classification
            )
        );
    }

    return <div className={styles.wrapper}>
        <table className={styles.classificationTable}>
            <thead>
                <th/>
                <th className={styles.username}>
                    {analysisGame.players.white.username || "White"}
                </th>
                <th/>
                <th className={styles.username}>
                    {analysisGame.players.black.username || "Black"}
                </th>
            </thead>

            {Object.values(Classification)
                .filter(classif => !excludedClassifications.includes(classif))
                .map(classif => (
                    <tr style={{ color: classificationColours[classif] }}>
                        <td className={styles.classificationNameCell}>
                            {t(classificationNames[classif])}
                        </td>
    
                        <td className={styles.classificationCountCell}>
                            {getClassificationCount(
                                nodeChain, PieceColour.WHITE, classif
                            )}
                        </td>
    
                        <td>
                            <img
                                src={classificationImages[classif]}
                                width={25}
                                height={25}
                            />
                        </td>
    
                        <td className={styles.classificationCountCell}>
                            {getClassificationCount(
                                nodeChain, PieceColour.BLACK, classif
                            )}
                        </td>
                    </tr>
                ))
            }
        </table>
    </div>;
}

export default ClassificationCountCard;