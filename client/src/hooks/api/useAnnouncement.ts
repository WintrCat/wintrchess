import { useMemo } from "react";
import { QueryClient, useQuery } from "@tanstack/react-query";

import { Announcement } from "shared/types/Announcement";

function useAnnouncement() {
    const queryClient = useMemo(() => new QueryClient(), []);

    const { data: announcement, status, refetch } = useQuery({
        queryKey: ["announcement"],
        queryFn: async () => {
            const announcementResponse = await fetch("/api/public/announcement");
            return await announcementResponse.json();
        },
        retry: false,
        refetchOnWindowFocus: false
    }, queryClient);

    if (status != "success") return { status, refetch };

    return {
        status,
        refetch,
        announcement: announcement as Announcement
    };
}

export default useAnnouncement;