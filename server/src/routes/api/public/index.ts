import { Router } from "express";

import announcementRouter from "./announcement";
import profileRouter from "./profile";
import archivedGameRouter from "./archivedGame";
import newsArticlesRouter from "./news/articles";
import newsPagesRouter from "./news/pages";

const router = Router();

router.use("/public",
    announcementRouter,
    profileRouter,
    archivedGameRouter,
    newsArticlesRouter,
    newsPagesRouter
);

export default router;