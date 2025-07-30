import { create } from "zustand";
import { cloneDeep } from "lodash-es";

import AnalysedGame from "shared/types/game/AnalysedGame";
import { defaultAnalysedGame } from "shared/constants/utils";

interface AnalysisGameStore {
    analysisGame: AnalysedGame;
    gameAnalysisOpen: boolean;

    setAnalysisGame: (game: AnalysedGame) => void;
    setGameAnalysisOpen: (open: boolean) => void;
}

export const useAnalysisGameStore = create<AnalysisGameStore>(set => ({
    analysisGame: cloneDeep(defaultAnalysedGame),

    gameAnalysisOpen: false,

    setAnalysisGame(game) {
        set({ analysisGame: game });
    },

    setGameAnalysisOpen(open) {
        set({ gameAnalysisOpen: open });
    }
}));

export default useAnalysisGameStore;