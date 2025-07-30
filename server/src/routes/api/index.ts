import { Router } from "express";

import publicApiRouter from "./public";
import accountRouter from "./account";
import analyseRouter from "./analysis/analyse";
import archiveRouter from "./analysis/archive";

const router = Router();

router.use("/api",
    publicApiRouter,
    accountRouter,
    analyseRouter,
    archiveRouter
);

export default router;