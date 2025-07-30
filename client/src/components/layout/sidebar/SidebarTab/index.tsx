import React from "react";

import SidebarTabProps from "./SidebarTabProps";
import * as styles from "./SidebarTab.module.css";

const defaultIconSize = "30px";

function SidebarTab({ 
    children,
    className,
    style,
    active,
    url,
    icon,
    iconSize
}: SidebarTabProps) {
    const isTabActive = active || (location.pathname == url);

    return <button 
        className={`${styles.sidebarTab} ${className}`} 
        onClick={() => {
            if (url) location.href = url;
        }}
        style={{
            ...style,
            backdropFilter: isTabActive ? "brightness(1.2)" : "",
            boxShadow: isTabActive ? "inset 0 -2px 0 0 var(--ui-blue)" : undefined
        }}
    >
        {icon && <img
            src={icon}
            height={iconSize || defaultIconSize}
        />}

        {children}
    </button>;
}

export default SidebarTab;