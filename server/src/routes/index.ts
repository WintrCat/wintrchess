import { Router } from "express";

import pagesRouter from "./pages";
import apiRouter from "./api";
import authRouter from "./auth";
import internalRouter from "./internal";

const router = Router();

router.use("/",
    internalRouter,
    apiRouter,
    authRouter,
    pagesRouter
);

export default router;