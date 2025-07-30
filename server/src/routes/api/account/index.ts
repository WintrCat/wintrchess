import { Router } from "express";

import profileRouter from "./profile";

const router = Router();

router.use("/account", profileRouter);

export default router;