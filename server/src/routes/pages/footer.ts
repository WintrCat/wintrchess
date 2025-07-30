import { Router } from "express";

import appRouter from "@/lib/appRouter";

const router = Router();

router.get("/help", appRouter("footer/helpCenter.html"));
router.get(/^\/(terms|privacy)/, appRouter("footer/legal.html"));

export default router;