import { Schema, model } from "mongoose";
import * as AuthTypes from "better-auth/types";

import Collection from "@/constants/Collection";
import { AuthInfer } from "@/lib/auth";

export const User = model(
    "user",
    new Schema<AuthInfer["user"]>({}, { strict: false }),
    Collection.USERS
);

export const Account = model(
    "account",
    new Schema<AuthTypes.Account>(),
    Collection.ACCOUNTS
);

export const Session = model(
    "session",
    new Schema<AuthInfer["session"]>(),
    Collection.SESSIONS
);

export const Verification = model(
    "verification",
    new Schema<AuthTypes.Verification>(),
    Collection.ACCOUNT_VERIFICATIONS 
);

export default { User, Account, Session, Verification };