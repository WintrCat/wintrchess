import { User as AuthBaseUser, GenericEndpointContext } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { APIError } from "better-auth/api";
import { StatusCodes } from "http-status-codes";

import schemas, { Registration } from "shared/constants/account/schemas";
import accountErrors from "shared/constants/account/errors";
import { randomNormalString } from "shared/lib/utils/string";
import { User } from "@/database/models/account";
import { getAuth, AuthInfer } from "@/lib/auth";
import { clearArchivedGames } from "../gameArchive";

const registrationValidator = createAuthMiddleware(async ctx => {
    if (!ctx.path.startsWith("/sign-up/email")) return;
    
    const registration: Registration = ctx.body;

    const parse = schemas.registration.safeParse(registration);

    if (!parse.success)
        throw new APIError(StatusCodes.BAD_REQUEST, {
            code: parse.error.issues.at(0)?.message
        });
});

const userDeleter = createAuthMiddleware(async ctx => {
    if (!ctx.path.startsWith("/delete-user")) return;

    if (!ctx.headers) throw new APIError(StatusCodes.UNAUTHORIZED);

    const session = await getAuth().api.getSession({
        headers: ctx.headers
    });

    if (!session) throw new APIError(StatusCodes.UNAUTHORIZED);

    clearArchivedGames(session.user.id);
});

export const requestProcessor = createAuthMiddleware(async ctx => {
    registrationValidator(ctx);
    userDeleter(ctx);
});

export const userInitialiser = async (
    user: AuthBaseUser,
    ctx?: GenericEndpointContext
): Promise<{ data: any }> => {
    if (!schemas.displayName.safeParse(user.name).success)
        throw new APIError(StatusCodes.BAD_REQUEST);

    const displayName = user.name
        .replace(/[^\p{L}\p{N}_ \-.]/gu, "")
        .slice(0, schemas.displayName.maxLength || 24);

    let username = user.name.toLowerCase()
        .replace(/[^a-z0-9_]/gi, "")
        .slice(0, schemas.username.maxLength || 20);

    const existingUser = await User.findOne({ username });

    if (existingUser || username.length < (schemas.username.minLength || 3)) {
        if (ctx?.path.startsWith("/sign-up/email"))
            throw new APIError(
                StatusCodes.CONFLICT,
                { code: accountErrors.USERNAME_TAKEN.code }
            );

        do {
            username = "player_" + randomNormalString(8, false).toLowerCase();
        } while (await User.findOne({ username }));
    }

    const initialisedUser: AuthInfer["user"] = {
        ...user,
        username: username,
        name: displayName.length >= (schemas.displayName.minLength || 3)
            ? displayName : username,
        roles: []
    };

    return { data: initialisedUser };
};