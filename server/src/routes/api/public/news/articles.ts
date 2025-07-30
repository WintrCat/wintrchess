import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import NewsArticle from "@/database/models/NewsArticle";

const router = Router();

const articlesPerPage = 10;

router.get("/news", async (req, res) => {
    const articleId = req.query.id?.toString();

    const page = Math.max(1,
        Number(req.query.page?.toString()) || 1
    );

    if (articleId) {
        const article = await NewsArticle.findOne({ id: articleId });

        if (!article) {
            return res.sendStatus(StatusCodes.NOT_FOUND);
        }

        res.json(article);
    } else {
        const articles = await NewsArticle.find()
            .sort({ timestamp: "desc" })
            .skip((page - 1) * articlesPerPage)
            .limit(articlesPerPage);

        res.json(articles);
    }
});

export default router;