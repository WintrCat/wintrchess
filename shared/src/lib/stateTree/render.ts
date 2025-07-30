import { Chess, BLACK } from "chess.js";
import { trim } from "lodash-es";
import { parseGame, ParseTree } from "@mliebelt/pgn-parser";

import {
    StateTreeNode,
    getNodeChain,
    getNodeMoveNumber,
    getNodeSiblings
} from "@/types/game/position/StateTreeNode";
import Game from "@/types/game/Game";
import { classifNags } from "@/constants/Classification";

type PGNHeaders = {
    [K in keyof NonNullable<ParseTree["tags"]>]?: string;
};

function getLastNodeResult(root: StateTreeNode) {
    const board = new Chess(
        getNodeChain(root).at(-1)?.state.fen
    );

    if (board.isCheckmate()) {
        return board.turn() == BLACK ? "1-0" : "0-1";
    }

    if (
        board.isDraw()
        || board.isStalemate()
        || board.isThreefoldRepetition()
    ) return "1/2-1/2";

    return "*";
}

function renderHeaders(headers: Record<string, string>) {
    return Object.keys(headers)
        .filter(key => !!headers[key])
        .map(key => `[${key} "${headers[key]}"]`)
        .join("\n");
}

/**
 * @description Renders a state tree into a PGN string. If a game context
 * is provided, headers will be generated from the PGN and other game data.
 * The result may be copied, should the final FEN positions in the state
 * tree and PGN be the same.
 */
function renderStateTree(
    stateTree: StateTreeNode,
    gameContext?: Partial<Game>
) {
    function renderNode(
        node: StateTreeNode,
        renderVariations = false,
        forceNumber = false
    ) {
        const renderedParts: string[] = [];

        const moveNumber = getNodeMoveNumber(node);
        const whiteMove = moveNumber % 1 == 0;

        if (whiteMove || forceNumber) {
            renderedParts.push(
                Math.floor(moveNumber)
                + (whiteMove ? "." : "...")
            );
        }

        renderedParts.push(node.state.move!.san);

        const nag = node.state.classification
            ? classifNags[node.state.classification]
            : undefined;

        if (nag) renderedParts.push(nag);

        if (renderVariations) {
            for (const sibling of getNodeSiblings(node)) {
                const renderedSibling = getNodeChain(sibling)
                    .map((node, index) => renderNode(
                        node, index != 0, index == 0
                    ))
                    .join(" ");

                renderedParts.push(`(${renderedSibling})`);
            }
        }

        return renderedParts.join(" ");
    }

    const nodeChain = getNodeChain(stateTree);

    // Render moves text
    const moves = nodeChain
        .filter(node => node.state.move)
        .map(node => renderNode(node, true))
        .join(" ");

    // Render headers from game context
    // Retain PGN result if last FEN of context PGN matches state tree
    let result = getLastNodeResult(stateTree);

    let headers: PGNHeaders = {
        FEN: gameContext?.initialPosition,
        Date: gameContext?.date?.toString(),
        TimeControl: gameContext?.timeControl,
        Variant: gameContext?.variant,
        White: gameContext?.players?.white.username,
        Black: gameContext?.players?.black.username
    };

    if (gameContext?.pgn) {
        const board = new Chess();
        board.loadPgn(gameContext.pgn);

        if (nodeChain.at(-1)?.state.fen == board.fen()) {
            const pgnResult = parseGame(gameContext.pgn).tags?.["Result"];
            if (pgnResult) result = pgnResult;
        }

        headers = { ...headers, ...board.getHeaders() };
    }

    return trim(`${renderHeaders(headers)}\n\n${moves} ${result}`);
}

export default renderStateTree;