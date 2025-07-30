import { CSSProperties } from "react";

import { StateTreeNode } from "shared/types/game/position/StateTreeNode";
import EvaluationGraphPoint from "./Point";

interface EvaluationGraphProps {
    className?: string;
    style?: CSSProperties;
    nodes: StateTreeNode[];
    selectedIndex: number;
    onPointClick?: (point: EvaluationGraphPoint) => void;
}

export default EvaluationGraphProps;