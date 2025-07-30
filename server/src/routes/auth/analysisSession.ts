import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { z, ZodType } from "zod";
import { verifySolution } from "altcha-lib";
import { Payload } from "altcha-lib/types";
import { randomBytes } from "crypto";

import Cookie from "shared/constants/Cookie";
import AnalysisSession from "@/database/models/AnalysisSession";
import { secureCookieOptions } from "@/lib/security/account";

const path = "/analysis-session";

const router = Router();

const defaultSessionActions = 80;

const payloadSchema = z.object({
    algorithm: z.enum(["SHA-1", "SHA-256", "SHA-512"]),
    challenge: z.string(),
    number: z.number(),
    salt: z.string(),
    signature: z.string()
}) satisfies ZodType<Payload>;

router.use(path, express.json());

router.post(path, async (req, res) => {
    const payload: Payload = req.body;

    if (!payloadSchema.safeParse(payload).success) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    if (!process.env.AUTH_SECRET) {
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    const captchaSolutionValid = await verifySolution(
        payload, process.env.AUTH_SECRET
    );

    if (!captchaSolutionValid) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    // Do not replace existing valid session
    const existingSessionToken = req.cookies[Cookie.ANALYSIS_SESSION_TOKEN];

    if (existingSessionToken) {
        const existingSession = await AnalysisSession.findOne({
            token: existingSessionToken
        });

        if (existingSession) {
            return res.sendStatus(StatusCodes.OK);
        }
    }

    // Generate session
    const sessionToken = randomBytes(32).toString("base64");

    await AnalysisSession.create({
        token: sessionToken,
        actions: process.env.ANALYSIS_SESSION_ACTIONS || defaultSessionActions,
        createdAt: new Date()
    });

    res.cookie(
        Cookie.ANALYSIS_SESSION_TOKEN,
        sessionToken,
        secureCookieOptions
    );

    res.send(sessionToken);
});

export default router;