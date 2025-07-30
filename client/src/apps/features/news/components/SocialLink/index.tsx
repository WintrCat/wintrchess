import React from "react";
import { Link } from "react-router-dom";

import SocialLinkProps from "./SocialLinkProps";
import * as styles from "./SocialLink.module.css";

function SocialLink({ icon, iconSize, title, url }: SocialLinkProps) {
    return <Link
        to={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
    >
        <div className={styles.wrapper}>
            {
                icon
                && <img
                    src={icon}
                    height={iconSize || "30px"}
                />
            }

            <span className={styles.username}>
                {title}
            </span>
        </div>
    </Link>;
}

export default SocialLink;