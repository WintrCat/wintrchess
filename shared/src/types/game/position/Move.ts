import { z } from "zod";

export const moveSchema = z.object({
    san: z.string(),
    uci: z.string()
});

export type Move = z.infer<typeof moveSchema>;

export default Move;