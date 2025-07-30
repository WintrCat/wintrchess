import ButtonColour from "@/components/common/Button/Colour";

export type VerifyStatus = "unsent" | "sending" | "sent";

export const editProfileStrings = "account.editProfile";

export const manageAccountStrings = "account.manageAccount";

export const verifyButtonStrings = (
    `${editProfileStrings}.email.verificationButton`
);

export const verifyButtonColours: Record<VerifyStatus, ButtonColour> = {
    unsent: ButtonColour.BLUE,
    sending: ButtonColour.BLUE,
    sent: ButtonColour.GREEN
};