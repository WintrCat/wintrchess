import { create } from "zustand";
import { Chess } from "chess.js";
import { cloneDeep } from "lodash-es";

import parseStateTree from "shared/lib/stateTree/parse";
import { addChildMove, getNodeChain } from "shared/types/game/position/StateTreeNode";
import { defaultAnalysedGame } from "shared/constants/utils";
import { EngineLine } from "shared/types/game/position/EngineLine";
import { LearnOpening } from "../data/openings";

interface LearnStore {
    selectedOpeningId: string;
    searchTerm: string;
    rootNode: typeof defaultAnalysedGame.stateTree;
    currentNode: typeof defaultAnalysedGame.stateTree;
    displayedEngineLines: EngineLine[];
    boardFlipped: boolean;
    autoplayEnabled: boolean;

    setSelectedOpeningId: (id: string) => void;
    setSearchTerm: (term: string) => void;
    setCurrentNode: (updater: typeof defaultAnalysedGame.stateTree | ((node: typeof defaultAnalysedGame.stateTree) => typeof defaultAnalysedGame.stateTree)) => void;
    setDisplayedEngineLines: (lines: EngineLine[]) => void;
    setBoardFlipped: (flipped: boolean) => void;
    setAutoplayEnabled: (enabled: boolean) => void;

    loadOpening: (opening: LearnOpening) => void;
    resetOpening: () => void;
    addFreeMove: (san: string) => void;
}

function createOpeningTree(opening: LearnOpening) {
    const board = new Chess();
    const sanMoves: string[] = [];

    for (const uciMove of opening.moves) {
        const move = board.move(uciMove);
        sanMoves.push(move.san);
    }

    const pgn = sanMoves.reduce((result, san, index) => {
        const isWhiteMove = index % 2 == 0;

        if (isWhiteMove) {
            return `${result}${Math.floor(index / 2) + 1}. ${san}`;
        }

        return `${result} ${san} `;
    }, "").trim() + " *";

    const game = {
        ...cloneDeep(defaultAnalysedGame),
        pgn
    };

    return parseStateTree(game);
}

const defaultRoot = cloneDeep(defaultAnalysedGame.stateTree);

const useLearnStore = create<LearnStore>((set, get) => ({
    selectedOpeningId: "",
    searchTerm: "",
    rootNode: defaultRoot,
    currentNode: defaultRoot,
    displayedEngineLines: [],
    boardFlipped: false,
    autoplayEnabled: false,

    setSelectedOpeningId(id) {
        set({ selectedOpeningId: id });
    },

    setSearchTerm(term) {
        set({ searchTerm: term });
    },

    setCurrentNode(node) {
        if (typeof node == "function") {
            return set(state => ({
                currentNode: node(state.currentNode)
            }));
        }

        set({ currentNode: node });
    },

    setDisplayedEngineLines(lines) {
        set({ displayedEngineLines: lines });
    },

    setBoardFlipped(flipped) {
        set({ boardFlipped: flipped });
    },

    setAutoplayEnabled(enabled) {
        set({ autoplayEnabled: enabled });
    },

    loadOpening(opening) {
        const rootNode = createOpeningTree(opening);

        set({
            selectedOpeningId: opening.id,
            rootNode,
            currentNode: rootNode,
            displayedEngineLines: [],
            autoplayEnabled: false
        });
    },

    resetOpening() {
        set(state => ({
            currentNode: state.rootNode,
            autoplayEnabled: false
        }));
    },

    addFreeMove(san) {
        const createdNode = addChildMove(get().currentNode, san);

        set({
            currentNode: createdNode,
            autoplayEnabled: false
        });
    }
}));

export function getLearnLineLength(rootNode: typeof defaultAnalysedGame.stateTree) {
    return Math.max(0, getNodeChain(rootNode).length - 1);
}

export default useLearnStore;
