import React from "react";

import TypographyProps from "./TypographyProps";
import * as styles from "./Typography.module.css";

import iconLogo from "@assets/img/logo.svg";

function Typography({
    includeIcon,
    className,
    style,
    iconClassName,
    iconStyle,
    textClassName,
    textStyle,
    onClick
}: TypographyProps) {
    return <div
        className={`${styles.wrapper} ${className}`}
        style={{ cursor: onClick && "pointer", ...style }}
        onClick={onClick}
    >
        {includeIcon
            && <img
                className={iconClassName}
                style={{ height: 40, ...iconStyle }}
                src={iconLogo}
                title="WINTR"
                draggable={false}
            />
        }

        <span
            className={`${styles.title} ${textClassName}`}
            style={textStyle}
        >
            Wintr

            <b style={{ letterSpacing: 0 }}>
                Chess
            </b>
        </span>
    </div>;
}

export default Typography;