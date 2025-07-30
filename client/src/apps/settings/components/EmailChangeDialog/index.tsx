import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import accountErrors from "shared/constants/account/errors";
import schemas from "shared/constants/account/schemas";
import Dialog from "@/components/common/Dialog";
import Button from "@/components/common/Button";
import LogMessage from "@/components/common/LogMessage";
import TextField from "@/components/common/TextField";
import authClient from "@/lib/auth";

import {
    VerifyStatus,
    verifyButtonStrings,
    editProfileStrings,
    verifyButtonColours
} from "@/apps/settings/constants/utils";

import EmailChangeDialogProps from "./EmailChangeDialogProps";
import * as settingsStyles from "../../index.module.css";
import * as styles from "./EmailChangeDialog.module.css";

function EmailChangeDialog({ onClose }: EmailChangeDialogProps) {
    const { t } = useTranslation(["settings", "common"]);

    const [ email, setEmail ] = useState("");
    
    const [ verifyStatus, setVerifyStatus ] = useState<VerifyStatus>("unsent");
    const [ verifyError, setVerifyError ] = useState<string>();

    const buttonMessages = useMemo(() => ({
        unsent: t(`${verifyButtonStrings}.unsent`),
        sending: t(`${verifyButtonStrings}.sending`),
        sent: t(`${verifyButtonStrings}.sent`)
    }), []);

    async function changeEmail() {
        if (verifyStatus == "sent") return;

        if (!schemas.email.safeParse(email).success)
            return setVerifyError(t(accountErrors.INVALID_EMAIL.message));

        setVerifyStatus("sending");

        const response = await authClient.changeEmail({
            callbackURL: "/settings/account",
            newEmail: email
        });

        if (response.error) {
            setVerifyStatus("unsent");
            
            if (response.error.code == "EMAIL_IS_THE_SAME") {
                setVerifyError(t(`${editProfileStrings}.email.same`));
            } else {
                setVerifyError(t("unknownError", { ns: "common" }));
            }

            return;
        }

        setVerifyError(undefined);
        setVerifyStatus("sent");
    }

    return <Dialog className={styles.wrapper} onClose={onClose}>
        <span className={styles.message}>
            {t(`${editProfileStrings}.email.verification`)}
        </span>

        <div className={settingsStyles.updateDialogInputContainer}>
            <TextField
                className={settingsStyles.inputField}
                placeholder={t("account.placeholders.email", { ns: "common" })}
                value={email}
                onChange={setEmail}
            />

            {verifyError && <LogMessage>
                {verifyError}
            </LogMessage>}
        </div>

        <div className={styles.verificationButtonContainer}>
            <Button
                className={styles.verificationButton}
                style={{
                    backgroundColor: verifyButtonColours[verifyStatus],
                    cursor: verifyStatus == "unsent" ? "pointer" : "default"
                }}
                disabled={verifyStatus == "sending"}
                onClick={changeEmail}
            >
                {buttonMessages[verifyStatus]}
            </Button>
        </div>
    </Dialog>;
}

export default EmailChangeDialog;