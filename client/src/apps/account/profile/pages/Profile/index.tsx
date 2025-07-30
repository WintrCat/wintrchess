import React from "react";
import { useParams } from "react-router-dom";

import { usePublicProfile } from "@/hooks/api/useProfile";
import ProfileCard from "@/apps/account/profile/components/ProfileCard";

import * as styles from "./Profile.module.css";

function Profile() {
    const params = useParams<{ username: string }>();

    const { profile } = usePublicProfile(params.username || "");

    return <div className={styles.wrapper}>
        <ProfileCard profile={profile} />
    </div>;
}

export default Profile;