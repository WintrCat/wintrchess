import { Chess, Move } from "chess.js";

import { BoardState } from "@/types/game/position/BoardState";
import { EngineLine } from "@/types/game/position/EngineLine";
import Evaluation from "@/types/game/position/Evaluation";

export interface ExtractedNode {
    board: Chess;
    state: BoardState;
    topLine: EngineLine;
    evaluation: Evaluation;
    secondTopLine?: EngineLine;
    secondTopMove?: Move;
    secondSubjectiveEvaluation?: Evaluation;
}

export interface ExtractedPreviousNode extends ExtractedNode {
    topMove: Move;
    subjectiveEvaluation?: Evaluation;
    playedMove?: Move;
}

export interface ExtractedCurrentNode extends ExtractedNode {
    topMove?: Move;
    subjectiveEvaluation: Evaluation;
    playedMove: Move;
}