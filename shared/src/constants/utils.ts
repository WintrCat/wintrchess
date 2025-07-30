import {
    PieceSymbol,
    PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING
} from "chess.js";

import AnalysedGame from "@/types/game/AnalysedGame";
import { StateTreeNode } from "@/types/game/position/StateTreeNode";
import { EngineLine } from "@/types/game/position/EngineLine";
import Evaluation from "@/types/game/position/Evaluation";
import GameResult from "@/constants/game/GameResult";
import Variant from "@/constants/game/Variant";

import startingLines from "@/resources/startingLines.json" with { type: "json" };

export const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const defaultRootNode: StateTreeNode = {
    id: "0",
    mainline: true,
    children: [],
    state: {
        fen: STARTING_FEN,
        engineLines: startingLines as EngineLine[]
    }
};

export const defaultAnalysedGame: AnalysedGame = {
    pgn: "*",
    initialPosition: STARTING_FEN,
    players: {
        white: {
            username: "White",
            result: GameResult.UNKNOWN
        },
        black: {
            username: "Black",
            result: GameResult.UNKNOWN
        }
    },
    stateTree: defaultRootNode,
    variant: Variant.STANDARD
};

export const defaultEvaluation: Evaluation = {
    type: "centipawn",
    value: 0
};

export const pieceNames: Record<PieceSymbol, string> = {
    [PAWN]: "Pawn",
    [KNIGHT]: "Knight",
    [BISHOP]: "Bishop",
    [ROOK]: "Rook",
    [QUEEN]: "Queen",
    [KING]: "King"
};

export const pieceValues: Record<PieceSymbol, number> = { 
    [PAWN]: 1,
    [KNIGHT]: 3,
    [BISHOP]: 3,
    [ROOK]: 5,
    [QUEEN]: 9,
    [KING]: Infinity
};

export const lichessCastlingMoves: Record<string, string> = {
    e8h8: "e8g8",
    e1h1: "e1g1",
    e8a8: "e8c8",
    e1a1: "e1c1"
};