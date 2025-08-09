import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";

import schemas from "shared/constants/account/schemas";
import { accountAuthenticator } from "@/lib/security/account";
import { User } from "@/database/models/account";

const path = "/change-username";

const router = Router();

router.use(path,
    express.text(),
    accountAuthenticator()
);

router.post("/change-username", async (req, res) => {
    if (!req.user) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    const username: string = req.body;

    if (!schemas.username.safeParse(username).success)
        return res.sendStatus(StatusCodes.BAD_REQUEST);

    const existingUsernameHolder = await User.findOne({ username });

    if (existingUsernameHolder)
        return res.sendStatus(StatusCodes.CONFLICT);

    await User.updateOne(
        { username: req.user.username },
        { username }
    );

    res.sendStatus(StatusCodes.OK);
});

export default router;