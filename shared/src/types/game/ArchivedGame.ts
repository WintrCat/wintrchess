import AnalysedGame from "./AnalysedGame";

export type ArchivedGameMetadata = (
    Omit<AnalysedGame, "stateTree" | "pgn">
);

export type ArchivedGame = (
    ArchivedGameMetadata & {
        userId: string;
        gzippedStateTree: Buffer;
    }
);

export type GameArchive = Record<string, ArchivedGameMetadata>;