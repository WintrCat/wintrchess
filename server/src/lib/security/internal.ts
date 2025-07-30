import { RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";

import Cookie from "shared/constants/Cookie";
import InternalSession from "@/database/models/InternalSession";

function internalAuthenticator(redirect = false): RequestHandler {
    function reject(res: Response) {
        res.status(StatusCodes.UNAUTHORIZED);
        if (redirect) res.redirect("/internal/login");
    }

    return async (req, res, next) => {
        if (req.originalUrl.startsWith("/internal/login"))
            return next();

        const internalToken = req.cookies[Cookie.INTERNAL_SESSION_TOKEN];
        if (!internalToken) return reject(res);

        const session = await InternalSession.findOne({
            token: internalToken
        });

        if (!session) return reject(res);

        next();
    };
}

export default internalAuthenticator;