import { ReactNode } from "react";

import { StateTreeNode } from "shared/types/game/position/StateTreeNode";

interface MoveProps {
    node?: StateTreeNode;
    children?: ReactNode;
}

export default MoveProps;