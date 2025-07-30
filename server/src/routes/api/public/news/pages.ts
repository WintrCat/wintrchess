import { Router } from "express";

import NewsArticle from "@/database/models/NewsArticle";

const router = Router();

const articlesPerPage = 10;

router.get("/news/pages", async (req, res) => {
    const pageCount = Math.ceil(
        await NewsArticle.countDocuments()
        / articlesPerPage
    );

    res.json(pageCount);
});

export default router;