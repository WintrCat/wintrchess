import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { randomBytes } from "crypto";

import Cookie from "shared/constants/Cookie";
import InternalSession from "@/database/models/InternalSession";
import { secureCookieOptions } from "@/lib/security/account";

const path = "/login";

const router = Router();

router.use(path, express.text());

router.post(path, async (req, res) => {
    const password: string = req.body;

    // If password is incorrect
    if (password != process.env.INTERNAL_PASSWORD) {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    // Create session
    const sessionToken = randomBytes(32).toString("base64");

    await InternalSession.create({
        token: sessionToken,
        createdAt: new Date()
    });

    res.cookie(
        Cookie.INTERNAL_SESSION_TOKEN,
        sessionToken,
        secureCookieOptions
    );

    res.sendStatus(StatusCodes.OK);
});

export default router;