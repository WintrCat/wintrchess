import { StateTreeNode } from "shared/types/game/position/StateTreeNode";

interface LineGroupProps {
    indentCount: number;
    nodes: (StateTreeNode | null)[];
    initialPosition?: string;
    forceWhiteMoveNumber?: boolean;
}

export default LineGroupProps;