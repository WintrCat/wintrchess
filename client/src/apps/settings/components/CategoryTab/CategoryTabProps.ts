import { CSSProperties, ReactNode } from "react";

interface CategoryTabProps {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    active?: boolean;
    onClick?: () => void;
}

export default CategoryTabProps;