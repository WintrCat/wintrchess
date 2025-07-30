import z from "zod";

export const playerProfileSchema = z.object({
    username: z.string(),
    rating: z.number(),
    title: z.string(),
    image: z.string()
}).partial();

export type PlayerProfile = z.infer<typeof playerProfileSchema>;

export default PlayerProfile;