import { CSSProperties } from "react";

interface TypographyProps {
    includeIcon?: boolean;
    className?: string;
    style?: CSSProperties;
    iconClassName?: string;
    iconStyle?: CSSProperties;
    textClassName?: string;
    textStyle?: CSSProperties;
    onClick?: () => void;
}

export default TypographyProps;