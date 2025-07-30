import React from "react";

import IndentProps from "./IndentProps";
import * as styles from "./Indent.module.css";

function Indent({ style }: IndentProps) {
    return <div
        className={styles.indent}
        style={style}
    />;
}

export default Indent;