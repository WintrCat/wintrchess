import { ReactNode, MouseEventHandler, CSSProperties } from "react";

interface ButtonProps {
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
    icon?: string;
    iconSize?: string;
    highlighted?: boolean;
    tooltipId?: string;
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default ButtonProps;