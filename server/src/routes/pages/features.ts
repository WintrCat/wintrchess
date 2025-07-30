import { Router } from "express";

import appRouter from "@/lib/appRouter";
import { accountAuthenticator } from "@/lib/security/account";

const router = Router();

router.get("/analysis", appRouter("features/analysis.html"));

router.get("/archive",
    accountAuthenticator(true),
    appRouter("features/archive.html")
);

router.get("/news*", appRouter("features/news.html"));

export default router;