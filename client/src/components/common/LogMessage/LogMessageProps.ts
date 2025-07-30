import { CSSProperties, ReactNode } from "react";

import LogMessageTheme from "./Theme";

interface LogMessageProps {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    theme?: LogMessageTheme;
    includeIcon?: boolean;
}

export default LogMessageProps;