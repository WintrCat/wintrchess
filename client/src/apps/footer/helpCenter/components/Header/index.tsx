import React, { ReactNode } from "react";

import * as styles from "./Header.module.css";

interface HeaderProps {
    image?: string;
    children: ReactNode;
    size?: string;
}

function Header({ image, children, size }: HeaderProps) {
    return <span
        className={styles.header}
        style={{ fontSize: size || "1.3rem" }}
    >
        {
            image
            && <img
                src={image}
                height={30}
            />
        }

        <b>{children}</b>
    </span>;
}

export default Header;