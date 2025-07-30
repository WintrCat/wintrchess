import { Router } from "express";

import captchaRouter from "./captcha";
import analysisSessionRouter from "./analysisSession";
import changeUsernameRouter from "./changeUsername";

const router = Router();

router.use("/auth",
    captchaRouter,
    analysisSessionRouter,
    changeUsernameRouter
);

export default router;