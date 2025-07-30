import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

import NewsArticle from "@/database/models/NewsArticle";
import internalAuthenticator from "@/lib/security/internal";

const path = "/news/publish";

const router = Router();

const requestSchema = z.object({
    id: z.string().optional(),
    title: z.string(),
    thumbnail: z.string().optional(),
    tag: z.object({
        name: z.string(),
        colour: z.string()
    }),
    timestamp: z.string(),
    content: z.string()
});

router.use(path,
    express.json({ limit: "10mb" }),
    internalAuthenticator()
);

router.post(path, async (req, res) => {
    const article: z.infer<typeof requestSchema> = req.body;

    if (!requestSchema.safeParse(article).success) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    await NewsArticle.updateOne(
        { id: article.id || uuidv4() },
        { $set: article },
        { upsert: true }
    );

    res.sendStatus(StatusCodes.OK);
});

export default router;