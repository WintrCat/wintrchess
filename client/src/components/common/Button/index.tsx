import React from "react";

import ButtonProps from "./ButtonProps";
import * as styles from "./Button.module.css";

function Button({
    className,
    style,
    children,
    icon,
    iconSize,
    highlighted,
    tooltipId,
    disabled,
    onClick
}: ButtonProps) {
    return <button
        className={`${styles.button} ${className}`}
        style={{
            filter: disabled
                ? "brightness(0.6)"
                : (highlighted ? "brightness(0.9)" : undefined),
            cursor: disabled ? "default" : undefined,
            ...style
        }}
        disabled={disabled}
        onClick={onClick}
        data-tooltip-id={tooltipId}
    >
        {icon && <img
            src={icon}
            height={iconSize || "22px"}
        />}

        {children}
    </button>;
}

export default Button;