import React from "react";

import SeparatorProps from "./SeparatorProps";
import * as styles from "./Separator.module.css";

function Separator({
    className,
    style,
    children
}: SeparatorProps) {
    return <div className={styles.wrapper}>
        <hr
            className={`${styles.separator} ${className}`}
            style={style}
        />

        {children && <div className={styles.text}>
            {children}
        </div>}

        <hr
            className={`${styles.separator} ${className}`}
            style={style}
        />
    </div>;
}

export default Separator;