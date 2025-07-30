import { useMemo } from "react";
import { create } from "zustand";

import Game from "shared/types/game/Game";
import LocalStorageKey from "@/constants/LocalStorageKey";
import { GameSource, GameSourceType, getGameSource } from "@/components/chess/GameSelector/GameSource";
import useLocalStorage from "./useLocalStorage";

export type SelectedGame = Game | string | null;

interface SelectedGameStore {
    selectedGame: SelectedGame;

    setSelectedGame: (game: SelectedGame) => void;
}

const useSelectedGameStore = create<SelectedGameStore>(set => ({
    selectedGame: null,

    setSelectedGame(game) {
        set({ selectedGame: game });
    }
}));

function useGameSelector() {
    const {
        value: savedGameSourceKey,
        set: setSavedGameSourceKey
    } = useLocalStorage(
        LocalStorageKey.LAST_GAME_SELECTOR_SOURCE,
        GameSource.PGN.key
    );

    const {
        parsedValue: savedFieldInputs,
        set: setSavedFieldInputs
    } = useLocalStorage<Record<string, string>>(
        LocalStorageKey.LAST_GAME_SELECTOR_INPUTS
    );

    const savedGameSource = useMemo(
        () => getGameSource(savedGameSourceKey), 
        [savedGameSourceKey]
    );

    const savedCurrentFieldInput = useMemo(() => (
        savedFieldInputs[savedGameSource.key] || ""
    ), [savedGameSource.key, savedFieldInputs]);

    function setSavedFieldInput(
        sourceKey: GameSourceType,
        value: string
    ) {
        setSavedFieldInputs({
            ...savedFieldInputs,
            [sourceKey]: value
        });
    }

    return {
        ...useSelectedGameStore(),
        savedGameSource,
        setSavedGameSource: setSavedGameSourceKey,
        savedFieldInputs,
        setSavedFieldInput,
        savedCurrentFieldInput
    };
}

export default useGameSelector;