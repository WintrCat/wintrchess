import React, {
    CSSProperties,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

import HoverDropdownProps from "./HoverDropdownProps";
import * as styles from "./HoverDropdown.module.css";

function HoverDropdown({
    children,
    dropdownClassName,
    dropdownStyle,
    menuClassName,
    menuStyle,
    menuPosition = "left",
    menuPositionStrategy,
    openStrategy = "hover",
    icon,
    url,
    options = []
}: HoverDropdownProps) {
    const [ open, setOpen ] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const closeMenu = useCallback(() => setOpen(false), []);

    useEffect(() => {
        if (openStrategy != "click") return;

        if (open) {
            document.addEventListener("click", closeMenu);
        } else {
            document.removeEventListener("click", closeMenu);
        }

        return () => document.removeEventListener("click", closeMenu);
    }, [open]);

    useEffect(() => {
        document.addEventListener("scroll", closeMenu);

        return () => document.removeEventListener("scroll", closeMenu);
    }, []);

    const dropdown = <div
        ref={dropdownRef}
        className={`${styles.dropdown} ${dropdownClassName}`}
        style={dropdownStyle}
        onMouseEnter={() => {
            if (openStrategy == "hover") setOpen(true);
        }}
        onClick={event => {
            if (openStrategy != "click") return;

            event.stopPropagation();
            setOpen(!open);
        }}
    >
        {icon && <img src={icon} style={{ width: "25px" }} />}

        {children}
    </div>;

    function getMenuPosition(): CSSProperties {
        const dropdownRect = dropdownRef.current?.getBoundingClientRect();

        if (!dropdownRect || menuPositionStrategy == "absolute") {
            return { position: "absolute", left: 0 };
        }

        return {
            position: "fixed",
            top: dropdownRect.top + dropdownRect.height,
            ...(menuPosition == "left"
                ? { left: dropdownRect.left }
                : { right: document.body.offsetWidth - dropdownRect.right }
            ),
            width: dropdownRect.width
        };
    }

    return <div
        ref={menuRef}
        className={styles.wrapper}
        style={{ cursor: (url || openStrategy == "click")
            ? "pointer" : "default"
        }}
        onMouseLeave={() => {
            if (openStrategy == "hover") setOpen(false);
        }}
    >
        {url ? <a href={url}>{dropdown}</a> : dropdown}

        {open && <div
            className={`${styles.menu} ${menuClassName}`}
            style={{ ...getMenuPosition(), ...menuStyle }}
        >
            {options.map(opt => <a
                className={styles.item}
                href={opt.url}
                onClick={opt.onClick}
                style={{ cursor: opt.onClick && "pointer" }}
            >
                {opt.icon && <img src={opt.icon} />}

                {opt.label}
            </a>)}
        </div>}
    </div>;
}

export default HoverDropdown;