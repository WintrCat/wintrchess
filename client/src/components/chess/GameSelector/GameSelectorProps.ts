import { CSSProperties } from "react";

import Game from "shared/types/game/Game";

interface GameSelectorProps {
    style?: CSSProperties;
    saveLocalStorage?: boolean;
    onGameSelect?: (game: Game | string | null) => void;
}

export default GameSelectorProps;