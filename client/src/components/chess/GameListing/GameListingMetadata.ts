import Game from "shared/types/game/Game";
import { ArchivedGameMetadata } from "shared/types/game/ArchivedGame";

type GameListingMetadata = (
    (Game | ArchivedGameMetadata)
    & Partial<Game>
    & Partial<ArchivedGameMetadata>
);

export default GameListingMetadata;