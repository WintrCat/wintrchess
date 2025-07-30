import { CSSProperties, ReactNode } from "react";

interface BlurBackgroundProps {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    center?: boolean;
    onClick?: () => void;
}

export default BlurBackgroundProps;