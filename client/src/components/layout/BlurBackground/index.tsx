import React, { useEffect } from "react";

import BlurBackgroundProps from "./BlurBackgroundProps";
import * as styles from "./BlurBackground.module.css";

function BlurBackground({
    children,
    className,
    style,
    center,
    onClick
}: BlurBackgroundProps) {
    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    return <div
        className={`${styles.wrapper} ${className}`}
        style={{
            ...(center && {
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }),
            ...style
        }}
        onClick={event => {
            event.stopPropagation();
            onClick?.();
        }}
    >
        {children}
    </div>;
}

export default BlurBackground;