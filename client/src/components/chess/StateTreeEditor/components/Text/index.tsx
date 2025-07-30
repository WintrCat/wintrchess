import React from "react";

import TextProps from "./TextProps";
import * as styles from "./Text.module.css";

function Text({ children, style }: TextProps) {
    return <span className={styles.text} style={style}>
        {children}
    </span>;
}

export default Text;