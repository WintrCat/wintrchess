import React, { useState } from "react";

import PlayerProfileProps from "./PlayerProfileProps";
import * as styles from "./PlayerProfile.module.css";

import iconDefaultProfileImage from "@assets/img/defaultprofileimage.png";

function PlayerProfile({ profile }: PlayerProfileProps) {
    const [ defaultImage, setDefaultImage ] = useState(false);

    return <div className={styles.wrapper}>
        {profile.image && <img 
            className={styles.profileImage} 
            src={defaultImage
                ? iconDefaultProfileImage
                : profile.image
            }
            onError={() => setDefaultImage(true)}
        />}

        {profile.title && <span className={styles.title}>
            {profile.title}
        </span>}

        <span className={styles.username}>
            {profile.username || "?"}
        </span>

        {profile.rating != undefined
            && <span className={styles.rating}>
                ({profile.rating})
            </span>
        }
    </div>;
}

export default PlayerProfile;