import { CSSProperties } from "react";

import Evaluation from "shared/types/game/position/Evaluation";
import PieceColour from "shared/constants/PieceColour";

interface EvaluationBarProps {
    className?: string;
    style?: CSSProperties;
    evaluation: Evaluation;
    moveColour?: PieceColour;
    flipped?: boolean;
}

export default EvaluationBarProps;