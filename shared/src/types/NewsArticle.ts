import z from "zod";

export const newsArticleSchema = z.object({
    id: z.string().optional(),
    title: z.string(),
    thumbnail: z.string().optional(),
    tag: z.object({
        name: z.string(),
        colour: z.string()
    }),
    timestamp: z.iso.datetime(),
    content: z.string()
});

export type NewsArticle = z.infer<typeof newsArticleSchema>;

export type NewsArticleMetadata = Omit<NewsArticle, "content">;

export default NewsArticle;