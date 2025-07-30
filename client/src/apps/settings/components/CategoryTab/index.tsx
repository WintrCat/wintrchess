import React from "react";

import CategoryTabProps from "./CategoryTabProps";
import * as styles from "./CategoryTab.module.css";

function CategoryTab({
    children,
    className,
    style,
    active,
    onClick
}: CategoryTabProps) {
    return <div
        className={`${styles.wrapper} ${className}`}
        style={{
            ...style,
            backgroundColor: active
                ? "rgba(255, 255, 255, 0.1)"
                : undefined
        }}
        onClick={onClick}
    >
        {children}
    </div>;
}

export default CategoryTab;