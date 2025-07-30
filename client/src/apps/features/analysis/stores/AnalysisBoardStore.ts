import { Dispatch, SetStateAction } from "react";
import { Square } from "react-chessboard/dist/chessboard/types";
import { create } from "zustand";

import { StateTreeNode } from "shared/types/game/position/StateTreeNode";
import useAnalysisGameStore from "./AnalysisGameStore";

interface AnalysisBoardStore {
    currentStateTreeNode: StateTreeNode;
    currentStateTreeNodeUpdate: boolean;
    boardFlipped: boolean;
    autoplayEnabled: boolean;

    selectedSourceSquare?: Square;
    playableSquares: Square[];
    capturableSquares: Square[];
    highlightedSquares: Square[];

    setCurrentStateTreeNode: Dispatch<SetStateAction<StateTreeNode>>;
    dispatchCurrentNodeUpdate: () => void;
    setBoardFlipped: (flipped: boolean) => void;
    setAutoplayEnabled: (enabled: boolean) => void;

    setSelectedSourceSquare: (square?: Square) => void;
    setPlayableSquares: (squares: Square[]) => void;
    setCapturableSquares: (squares: Square[]) => void;
    setHighlightedSquares: Dispatch<SetStateAction<Square[]>>;
}

const useAnalysisBoardStore = create<AnalysisBoardStore>(set => ({
    currentStateTreeNode: (
        useAnalysisGameStore.getInitialState().analysisGame.stateTree
    ),
    currentStateTreeNodeUpdate: false,
    boardFlipped: false,
    autoplayEnabled: false,

    playableSquares: [],
    capturableSquares: [],
    highlightedSquares: [],

    setCurrentStateTreeNode(node) {
        if (typeof node == "function") {
            return set(state => ({
                currentStateTreeNode: node(state.currentStateTreeNode)
            }));
        }
        
        set({ currentStateTreeNode: node });
    },

    dispatchCurrentNodeUpdate() {
        set(state => ({
            currentStateTreeNodeUpdate: !state.currentStateTreeNodeUpdate
        }));
    },

    setBoardFlipped(flipped) {
        set({ boardFlipped: flipped });
    },

    setAutoplayEnabled(enabled) {
        set({ autoplayEnabled: enabled });
    },

    setSelectedSourceSquare(square) {
        set({ selectedSourceSquare: square });
    },

    setPlayableSquares(squares) {
        set({ playableSquares: squares });
    },

    setCapturableSquares(squares) {
        set({ capturableSquares: squares });
    },

    setHighlightedSquares(squares) {
        if (typeof squares == "function") {
            return set(state => ({
                highlightedSquares: squares(state.highlightedSquares)
            }));
        }

        set({ highlightedSquares: squares });
    }
}));

export default useAnalysisBoardStore;