import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { UserProfile, AuthedUserProfile } from "shared/types/UserProfile";

type PageShowListener = Parameters<typeof addEventListener<"pageshow">>[1];

export function usePublicProfile(username: string) {
    const { data: profile, status, refetch } = useQuery({
        queryKey: ["publicProfile", username],
        queryFn: async () => {
            const profileResponse = await fetch(`/api/public/profile/${username}`);
            if (!profileResponse.ok) throw new Error();
        
            const profile: UserProfile = await profileResponse.json();
        
            return profile;
        },
        refetchOnWindowFocus: false,
        retry: false
    });

    return status == "success"
        ? { profile: profile!, status, refetch }
        : { profile, status, refetch };
}

export function useAuthedProfile() {
    const { data: profile, status, refetch } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const profileResponse = await fetch("/api/account/profile");
            if (!profileResponse.ok) throw new Error();
        
            const profile: AuthedUserProfile = await profileResponse.json();
        
            return profile;
        },
        refetchOnWindowFocus: false,
        retry: false
    });

    useEffect(() => {
        const refetchPersisted: PageShowListener = event => {
            if (event.persisted) refetch();
        };

        addEventListener("pageshow", refetchPersisted);

        return () => removeEventListener("pageshow", refetchPersisted);
    }, []);

    return status == "success"
        ? { profile: profile!, status, refetch }
        : { profile, status, refetch };
}