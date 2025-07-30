import React from "react";
import { range } from "lodash-es";

import { getNodeMoveNumber } from "shared/types/game/position/StateTreeNode";
import { PieceColour } from "shared/constants/PieceColour";
import Indent from "../Indent";
import Text from "../Text";
import Move from "../Move";

import LineGroupProps from "./LineGroupProps";
import * as styles from "./LineGroup.module.css";

const INDENT_GAP = 15;

function LineGroup({
    indentCount,
    nodes,
    initialPosition,
    forceWhiteMoveNumber
}: LineGroupProps) {
    const firstNode = nodes.at(0);

    return <div className={styles.wrapper}>
        {range(indentCount).map(index => <Indent
            style={{
                position: "absolute",
                top: "-3px",
                left: `${index * INDENT_GAP}px`
            }}
        />)}

        <Text style={{ marginLeft: `${indentCount * INDENT_GAP}px` }}>
            {firstNode
                ? Math.trunc(
                    getNodeMoveNumber(firstNode, initialPosition)
                )
                : 0
            }
            
            {(
                forceWhiteMoveNumber
                || firstNode?.state.moveColour == PieceColour.WHITE
            ) ? "." : "..."}
        </Text>

        {nodes.map(node => node
            ? <Move node={node} />
            : <Text>...</Text>
        )}
    </div>;
}

export default LineGroup;