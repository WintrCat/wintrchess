import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { AuthedUserProfile } from "shared/types/UserProfile";
import { accountAuthenticator } from "@/lib/security/account";

const path = "/profile";

const router = Router();

router.use(path, accountAuthenticator());

router.get(path, async (req, res) => {
    if (!req.user) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    res.json({
        email: req.user.email,
        displayName: req.user.name,
        username: req.user.username,
        roles: req.user.roles,
        createdAt: req.user.createdAt.toISOString()
    } satisfies AuthedUserProfile);
});

export default router;