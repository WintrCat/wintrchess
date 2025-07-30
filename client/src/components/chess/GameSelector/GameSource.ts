export enum GameSelectorButton {
    SEARCH_GAMES,
    UPLOAD_FILE
}

export type GameSourceType = "PGN"
    | "FEN"
    | "CHESS_COM"
    | "LICHESS";

export interface GameSourceData {
    key: GameSourceType;
    title: string;
    expandField: boolean;
    selectorButton?: GameSelectorButton;
}

export const GameSource: Record<GameSourceType, GameSourceData> = {
    PGN: {
        key: "PGN",
        title: "PGN",
        expandField: true,
        selectorButton: GameSelectorButton.UPLOAD_FILE
    },
    FEN: {
        key: "FEN",
        title: "FEN",
        expandField: false
    },
    CHESS_COM: {
        key: "CHESS_COM",
        title: "Chess.com",
        expandField: false,
        selectorButton: GameSelectorButton.SEARCH_GAMES
    },
    LICHESS: {
        key: "LICHESS",
        title: "Lichess",
        expandField: false,
        selectorButton: GameSelectorButton.SEARCH_GAMES
    }
};

export function getGameSource(
    key: string,
    defaultKey: GameSourceType = GameSource.PGN.key
) {
    return (
        Object.values(GameSource).find(
            source => source.key == key
        )
        || GameSource[defaultKey]
    );
}