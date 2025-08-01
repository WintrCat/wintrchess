import React from "react";

import { formatDate } from "shared/lib/utils/date";

import ProfileCardProps from "./ProfileCardProps";
import * as styles from "./ProfileCard.module.css";

function ProfileCard({
    className,
    style,
    profile
}: ProfileCardProps) {
    return <div
        className={`${styles.wrapper} ${className}`}
        style={{
            animation: !profile
                ? `${styles.pulse} 1.5s infinite ease`
                : undefined,
            ...style
        }}
    >
        {profile && <>
            <div className={styles.avatar}>
                AVATAR
            </div>

            <div className={styles.details}>
                <span className={styles.displayName}>
                    {profile.displayName}

                    {profile.roles.map(role => <span key={role}>
                        {role}
                    </span>)}
                </span>

                <span className={styles.username} contentEditable>
                    {profile.username}
                </span>

                <span>
                    Member since{" "}
                    {formatDate(new Date(profile.createdAt))}
                </span>
            </div>
        </>}
    </div>;
}

export default ProfileCard;