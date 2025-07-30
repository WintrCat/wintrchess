import { CSSProperties } from "react";

import { PieceColour } from "shared/constants/PieceColour";
import GameListingMetadata from "./GameListingMetadata";

interface GameListingProps<T extends GameListingMetadata> {
    className?: string;
    style?: CSSProperties;
    game: T;
    perspective?: PieceColour;
    selected?: boolean;
    onClick?: (game: T) => void;
    onSelect?: (selected: boolean, game: T) => void;
}

export default GameListingProps;