import { Router } from "express";

import { accountAuthenticator } from "@/lib/security/account";
import appRouter from "@/lib/appRouter";

const router = Router();

router.get(/^\/(signin|signup)/,
    appRouter("account/signin.html")
);

// Profile page route disabled until the page is useful
// router.get("/profile/:username", async (req, res, next) => {
//     const user = await User.findOne({
//         username: req.params.username
//     });

//     if (!user) return next();

//     const profileRouter = appRouter(
//         "account/profile.html",
//         async req => req.params
//     );

//     profileRouter(req, res, next);
// });

router.get("/auth/reset-password",
    accountAuthenticator(true),
    appRouter("account/resetPassword.html")
);

export default router;