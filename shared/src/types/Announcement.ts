import z from "zod";

export const announcementSchema = z.object({
    colour: z.string(),
    content: z.string()
});

export type Announcement = z.infer<typeof announcementSchema>;