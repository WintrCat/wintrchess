import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { UserProfile } from "shared/types/UserProfile";
import { User } from "@/database/models/account";

const router = Router();

router.get("/profile/:username", async (req, res) => {
    const user = await User.findOne({
        username: req.params.username
    }).lean();

    if (!user?.username) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    res.json({
        displayName: user.name,
        username: user.username,
        roles: user.roles,
        createdAt: user.createdAt.toISOString()
    } satisfies UserProfile);
});

export default router;