import { createContext } from "react";

import { StateTreeNode } from "shared/types/game/position/StateTreeNode";

type MoveClickEventListener = (node: StateTreeNode) => void;

const MoveClickEventContext = createContext<MoveClickEventListener | undefined>(undefined);

export default MoveClickEventContext;