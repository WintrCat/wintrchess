import { Move, Square, PieceSymbol, PAWN } from "chess.js";

import Evaluation from "@/types/game/position/Evaluation";
import { PieceColour, adaptPieceColour } from "@/constants/PieceColour";
import { pieceNames } from "@/constants/utils";

export function parseFen(fen: string) {
    const fenParts = fen.split(" ");

    const turnColour = fenParts[1] == "w"
        ? PieceColour.WHITE : PieceColour.BLACK;

    const castlingRights = fenParts[2];

    return {
        parts: fenParts,
        turnColour,
        castlingRights: {
            kingside: {
                white: castlingRights.includes("K"),
                black: castlingRights.includes("k")
            },
            queenside: {
                white: castlingRights.includes("Q"),
                black: castlingRights.includes("q")
            }
        },
        enPassantSquare: fenParts[3] == "-" ? undefined : fenParts[3],
        fiftyMoveClock: parseInt(fenParts[4]),
        fullMoveCount: parseInt(fenParts[5])
    };
}

export function setFenTurn(fen: string, colour: PieceColour) {
    const parsedFen = parseFen(fen);

    // If turn colour changed, clear en passant square
    if (parsedFen.parts[1] != colour) {
        parsedFen.parts[3] = "-";
    }

    // Update turn colour
    parsedFen.parts[1] = adaptPieceColour(colour);

    return parsedFen.parts.join(" ");
}

export function parseSanMove(san: string) {
    return {
        castling: san.includes("O"),
        check: san.includes("+"),
        capture: san.includes("x"),
        promotion: san.includes("="),
        checkmate: san.includes("#"),
        piece: san.charAt(0)
    };
}

export function parseUciMove(uci: string) {
    return {
        from: uci.slice(0, 2) as Square,
        to: uci.slice(2, 4) as Square,
        promotion: uci.charAt(4) || undefined
    };
}

export function isMovePromotion(piece: PieceSymbol, to: Square) {
    const rank = to.at(1);
    return piece == PAWN && (rank == "8" || rank == "1");
}

export function getSimpleNotation(move: Move) {
    if (move.isKingsideCastle()) {
        return "Short castles";
    }

    if (move.isQueensideCastle()) {
        return "Long castles";
    }

    const pieceName = pieceNames[move.piece];

    const result = [
        pieceName,
        move.captured ? "on" : "from",
        move.from,
        move.captured ? "takes" : "to",
        move.to
    ];

    if (move.san.includes("#")) {
        result.push("checkmate");
    } else if (move.san.includes("+")) {
        result.push("check");
    }

    if (move.promotion) {
        result.push(`(${pieceNames[move.promotion]})`);
    }

    return result.join(" ");
}

export function stringifyEvaluation(
    evaluation: Evaluation,
    forceSign = false,
    precision = 2
) {
    const roundedValue = (evaluation.value / 100).toFixed(precision);

    if (evaluation.type == "centipawn") {
        if (forceSign && evaluation.value >= 0) {
            return "+" + roundedValue;
        }

        return roundedValue;
    }

    if (!forceSign) {
        return "M" + Math.abs(evaluation.value);
    }

    if (evaluation.value > 0) {
        return `+M${evaluation.value}`;
    } else if (evaluation.value < 0) {
        return `-M${Math.abs(evaluation.value)}`;
    }

    return "M0";
}

export function getCaptureSquare(move: Move) {
    return move.isEnPassant()
        ? (move.to[0] + move.from[1]) as Square
        : move.to;
}

export function getSubjectiveEvaluation(
    evaluation: Evaluation,
    colour: PieceColour
): Evaluation {
    return {
        type: evaluation.type,
        value: evaluation.value * (
            colour == PieceColour.WHITE ? 1 : -1
        )
    };
}