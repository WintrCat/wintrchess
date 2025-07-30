import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import Cookie from "shared/constants/Cookie";
import AnalysisSession from "@/database/models/AnalysisSession";

const analysisAuthenticator: RequestHandler = async (req, res, next) => {
    // Ensure existence of session token in cookies
    const sessionToken = req.cookies[Cookie.ANALYSIS_SESSION_TOKEN];

    if (!sessionToken) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    // Verify token against the database
    const session = await AnalysisSession.findOne({ token: sessionToken });

    if (!session?.actions) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    const newActions = session.actions - 1;

    if (newActions > 0) {
        session.actions = newActions;
        await session.save();
    } else {
        await session.deleteOne();
    }

    next();
};

export default analysisAuthenticator;