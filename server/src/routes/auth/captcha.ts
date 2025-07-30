import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { createChallenge } from "altcha-lib";

const router = Router();

router.get("/captcha", async (req, res) => {
    if (!process.env.AUTH_SECRET) {
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    const challenge = await createChallenge({
        hmacKey: process.env.AUTH_SECRET,
        maxNumber: 100_000
    });

    res.json(challenge);
});

export default router;