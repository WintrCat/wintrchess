import React, {
    Children,
    ReactNode,
    useContext,
    useEffect,
    forwardRef,
    isValidElement
} from "react";
import {
    CustomSquareProps,
    CustomSquareRenderer
} from "react-chessboard/dist/chessboard/types";

import { StateTreeNode } from "shared/types/game/position/StateTreeNode";
import { parseUciMove } from "shared/lib/utils/chess";
import {
    classificationColours,
    classificationImages
} from "@analysis/constants/classifications";

import { SquaresContext } from "./SquaresContext";
import * as styles from "./Square.module.css";

function getSquareElements(children: ReactNode) {
    const squareElements = Children.toArray(children);

    const piece = squareElements.find(element => (
        isValidElement(element) && element.props.piece
    ));

    const notations = squareElements.filter(element => (
        isValidElement(element) && element.props.row != undefined
    ));

    return [ piece, ...notations ];
}

function createSquareRenderer(
    node: StateTreeNode,
    enableClassifications: boolean
) {
    return forwardRef<HTMLDivElement, CustomSquareProps>((
        { children, style, square }, ref
    ) => {
        const squares = useContext(SquaresContext);

        useEffect(() => {
            if (!squares.pieceDropFlag) return;
            squares.setPieceDropFlag(false);
        }, [squares.pieceDropFlag]);

        const playedMove = node.state.move?.uci
            ? parseUciMove(node.state.move.uci)
            : undefined;

        const highlightColour = node.state.classification
            ? classificationColours[node.state.classification]
            : "#ffff33";

        const [ piece, ...notations ] = getSquareElements(children);

        return <div ref={ref} style={{ ...style, position: "relative" }}>
            {(!squares.pieceDropFlag || square != playedMove?.from) && piece}

            {notations}

            {(square == playedMove?.from || square == playedMove?.to)
                && <div className={styles.playedHighlight} style={{
                    backgroundColor: highlightColour
                }}/>
            }

            {squares.playable.includes(square) && <div
                className={styles.playableMoveCircle}
            />}

            {squares.capturable.includes(square) && <div
                className={styles.capturableMoveCircle}
            />}

            {squares.highlighted.includes(square)
                && <div className={styles.highlight} />
            }

            {node.state.classification
                && square == playedMove?.to
                && enableClassifications
                && <img
                    src={classificationImages[node.state.classification]}
                    className={styles.classification}
                />
            }
        </div>;
    }) as CustomSquareRenderer;
}

export default createSquareRenderer;