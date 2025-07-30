import { CSSProperties, ReactNode } from "react";

interface HoverDropdownOption {
    icon?: any;
    label: ReactNode;
    url?: string;
    onClick?: () => void;
}

interface HoverDropdownProps {
    children: ReactNode;
    dropdownClassName?: string;
    dropdownStyle?: CSSProperties;
    menuClassName?: string;
    menuStyle?: CSSProperties;
    menuPosition?: "left" | "right";
    menuPositionStrategy?: "absolute" | "fixed";
    openStrategy?: "hover" | "click";
    icon?: any;
    url?: string;
    options?: HoverDropdownOption[];
}

export default HoverDropdownProps;