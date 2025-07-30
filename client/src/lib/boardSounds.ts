import { Chess } from "chess.js";

import { StateTreeNode } from "shared/types/game/position/StateTreeNode";
import { parseSanMove } from "shared/lib/utils/chess";

import iconMove from "@assets/audio/move.mp3";
import iconCheck from "@assets/audio/check.mp3";
import iconCapture from "@assets/audio/capture.mp3";
import iconCastle from "@assets/audio/castle.mp3";
import iconPromote from "@assets/audio/promote.mp3";
import iconGameend from "@assets/audio/gameend.mp3";

const moveSounds = {
    move: iconMove,
    check: iconCheck,
    capture: iconCapture,
    castle: iconCastle,
    promote: iconPromote,
    gameEnd: iconGameend
};

function playBoardSound(node: StateTreeNode) {
    const move = node.state.move;
    if (!move) return;

    const board = new Chess(node.state.fen);

    if (board.isGameOver()) {
        new Audio(moveSounds.gameEnd).play();
    }

    const parsedMove = parseSanMove(move.san);

    if (parsedMove.check || parsedMove.checkmate) {
        new Audio(moveSounds.check).play();
    } else if (parsedMove.castling) {
        new Audio(moveSounds.castle).play();
    } else if (parsedMove.promotion) {
        new Audio(moveSounds.promote).play();
    } else if (parsedMove.capture) {
        new Audio(moveSounds.capture).play();
    } else {
        new Audio(moveSounds.move).play();
    }
}

export default playBoardSound;