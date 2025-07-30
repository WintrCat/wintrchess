export const accountErrors = {
    // Email validation
    INVALID_EMAIL: {
        code: "INVALID_EMAIL",
        message: "account.errors.invalidEmail"
    },

    INVALID_EMAIL_OR_PASSWORD: {
        code: "INVALID_EMAIL_OR_PASSWORD",
        message: "account.errors.incorrectEmailPassword"
    },

    EMAIL_NOT_VERIFIED: {
        code: "EMAIL_NOT_VERIFIED",
        message: "account.errors.unverifiedEmail"
    },

    EMAIL_TAKEN: {
        code: "USER_ALREADY_EXISTS",
        message: "account.errors.emailTaken"
    },

    // Password validation
    PASSWORD_TOO_SHORT: {
        code: "PASSWORD_TOO_SHORT",
        message: "account.errors.passwordTooShort"
    },

    PASSWORD_TOO_LONG: {
        code: "PASSWORD_TOO_LONG",
        message: "account.errors.passwordTooLong"
    },

    // Display name validation
    INVALID_DISPLAY_NAME: {
        code: "INVALID_DISPLAY_NAME",
        message: "account.errors.displayNameInvalid"
    },

    DISPLAY_NAME_TOO_SHORT: {
        code: "DISPLAY_NAME_TOO_SHORT",
        message: "account.errors.displayNameTooShort"
    },

    DISPLAY_NAME_TOO_LONG: {
        code: "DISPLAY_NAME_TOO_LONG",
        message: "account.errors.displayNameTooLong"
    },

    // Username validation
    USERNAME_TAKEN: {
        code: "USERNAME_TAKEN",
        message: "account.errors.usernameTaken"
    },

    USERNAME_TOO_SHORT: {
        code: "USERNAME_TOO_SHORT",
        message: "account.errors.usernameTooShort"
    },

    USERNAME_TOO_LONG: {
        code: "USERNAME_TOO_LONG",
        message: "account.errors.usernameTooLong"
    },

    INVALID_USERNAME: {
        code: "INVALID_USERNAME",
        message: "account.errors.usernameAlphanumeric"
    }
} as const;

export type AccountErrorCode = (
    typeof accountErrors[keyof typeof accountErrors]["code"]
);

export default accountErrors;