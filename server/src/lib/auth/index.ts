import cluster from "cluster";
import mongoose, { mongo } from "mongoose";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

import schemas, { additionalUserFields } from "shared/constants/account/schemas";
import Collection from "@/constants/Collection";
import { sendAccountEmail } from "@/lib/email";

import { requestProcessor, userInitialiser } from "./registration";

export type AuthType = ReturnType<typeof createAuth>;
export type AuthInfer = AuthType["$Infer"]["Session"];

let instance: AuthType | null = null;

function createAuth(database: mongo.Db) {
    if (!process.env.ORIGIN) {
        throw new Error("origin not specified.");
    }

    if (!process.env.AUTH_SECRET) {
        throw new Error("auth secret not specified.");
    }

    return betterAuth({
        baseURL: `${process.env.ORIGIN}/auth/account`,
        secret: process.env.AUTH_SECRET,
        database: mongodbAdapter(database),
        emailAndPassword: {
            enabled: true,
            minPasswordLength: schemas.password.minLength || 8,
            maxPasswordLength: schemas.password.maxLength || 128,
            requireEmailVerification: true,
            sendResetPassword: async ({ user, url }) => sendAccountEmail({
                recipient: user.email,
                subject: "Reset your WintrChess password",
                message: "Please reset your WintrChess account's "
                    + "password by clicking the button below:",
                buttonLabel: "Reset Password",
                buttonUrl: url,
                plaintextFallback: "Please use the link to reset your"
                    + ` WintrChess account's password: ${url}`
            }),
            revokeSessionsOnPasswordReset: true
        },
        emailVerification: {
            autoSignInAfterVerification: true,
            sendVerificationEmail: async ({ user, url }) => sendAccountEmail({
                recipient: user.email,
                subject: "Verify your WintrChess account",
                message: "Thank you for creating an account on WintrChess! "
                    + "Please verify your account by clicking the button below:",
                buttonLabel: "Verify Account",
                buttonUrl: url,
                plaintextFallback: `Please verify your WintrChess account: ${url}`
            })
        },
        socialProviders: {
            google: {
                clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!
            }
        },
        user: {
            modelName: Collection.USERS,
            additionalFields: additionalUserFields,
            changeEmail: {
                enabled: true,
                sendChangeEmailVerification: async (ctx) => sendAccountEmail({
                    recipient: ctx.newEmail,
                    subject: "Verify your new email address",
                    message: "Please verify your WintrChess account's new"
                        + " email address by clicking the button below:",
                    buttonLabel: "Verify Email Address",
                    buttonUrl: ctx.url,
                    plaintextFallback: "Please verify your WintrChess account's"
                        + ` new email address: ${ctx.url}`
                })
            },
            deleteUser: { enabled: true }
        },
        account: { modelName: Collection.ACCOUNTS },
        session: { modelName: Collection.SESSIONS },
        verification: { modelName: Collection.ACCOUNT_VERIFICATIONS },
        hooks: { before: requestProcessor },
        databaseHooks: {
            user: {
                create: { before: userInitialiser }
            }
        },
        logger: { disabled: cluster.worker?.id != 1 },
        advanced: { cookiePrefix: "wintrchess" }
    });
}

export function getAuth() {
    if (!mongoose.connection.db) throw new Error(
        "cannot initialise auth without database connection."
    );

    return instance ??= createAuth(mongoose.connection.db);
}

export default getAuth;