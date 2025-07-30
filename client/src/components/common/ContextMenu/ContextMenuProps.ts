import { CSSProperties } from "react";

import { ContextMenuPosition, ContextMenuOption } from "./types";

interface ContextMenuProps {
    position: ContextMenuPosition;
    menuStyle?: CSSProperties;
    optionStyle?: CSSProperties;
    options: ContextMenuOption[];
}

export default ContextMenuProps;