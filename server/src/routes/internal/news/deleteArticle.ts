import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";

import NewsArticle from "@/database/models/NewsArticle";
import internalAuthenticator from "@/lib/security/internal";

const path = "/news/delete";

const router = Router();

interface DeleteArticleRequest {
    id?: string;
}

router.use(path,
    express.json(),
    internalAuthenticator()
);

router.post(path, async (req, res) => {
    const { id }: DeleteArticleRequest = req.body;

    if (!id) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    await NewsArticle.deleteOne({ id });

    res.sendStatus(StatusCodes.OK);
});

export default router;