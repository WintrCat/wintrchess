import { RequestHandler, CookieOptions } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { StatusCodes } from "http-status-codes";

import getAuth from "@/lib/auth";

export const secureCookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: true,
    secure: true
};

/**
 * @description Enforces that the user has a valid session. Adds
 * `req.session` and `req.user` upon successful authentication.
 */
export function accountAuthenticator(redirect = false): RequestHandler {
    return async (req, res, next) => {
        const ticket = await getAuth().api.getSession({
            headers: fromNodeHeaders(req.headers)
        });

        if (!ticket) return redirect
            ? res.redirect("/signin")
            : res.sendStatus(StatusCodes.UNAUTHORIZED);

        req.session = ticket.session;
        req.user = ticket.user;

        next();
    };
}