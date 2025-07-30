import AnalysedGame from "shared/types/game/AnalysedGame";
import { StateTreeNode } from "shared/types/game/position/StateTreeNode";

interface ShareDialogProps {
    game: AnalysedGame;
    currentNode: StateTreeNode;
    onClose: () => void;
}

export default ShareDialogProps;