import { FieldAttribute } from "better-auth/db";
import z from "zod";

import AccountError from "./errors";

export const additionalUserFields = ({
    username: { type: "string", input: false },
    roles: { type: "string[]", input: false }
} as const) satisfies Record<string, FieldAttribute>;

export const email = z.email(AccountError.INVALID_EMAIL.code);

export const displayName = z.string()
    .min(3, AccountError.DISPLAY_NAME_TOO_SHORT.code)
    .max(24, AccountError.DISPLAY_NAME_TOO_LONG.code)
    .regex(/^[\p{L}\p{N}_ \-.]+$/u, AccountError.INVALID_DISPLAY_NAME.code);

export const username = z.string()
    .min(3, AccountError.USERNAME_TOO_SHORT.code)
    .max(20, AccountError.USERNAME_TOO_LONG.code)
    .regex(/^[a-z0-9_]+$/i, AccountError.INVALID_USERNAME.code);

export const password = z.string()
    .min(8, AccountError.PASSWORD_TOO_SHORT.code)
    .max(128, AccountError.PASSWORD_TOO_LONG.code);

export const registration = z.object({
    email,
    password,
    name: username,
    callbackURL: z.string().optional()
});

export type Registration = z.infer<typeof registration>;

const schemas = {
    email,
    displayName,
    username,
    password,
    registration
};

export default schemas;