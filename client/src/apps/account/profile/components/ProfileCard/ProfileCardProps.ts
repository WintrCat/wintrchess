import { CSSProperties } from "react";

import { UserProfile } from "shared/types/UserProfile";

interface ProfileCardProps {
    className?: string;
    style?: CSSProperties;
    profile?: UserProfile;
    editable?: boolean;
}

export default ProfileCardProps;