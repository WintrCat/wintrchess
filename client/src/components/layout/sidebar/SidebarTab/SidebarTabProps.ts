import { ReactNode, CSSProperties } from "react";

interface SidebarTabProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    active?: boolean;
    url?: string;
    icon?: string;
    iconSize?: string;
}

export default SidebarTabProps;