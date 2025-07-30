import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuthedProfile } from "@/hooks/api/useProfile";
import useAuthErrors from "@/hooks/auth/useAuthErrors";
import Dialog from "@/components/common/Dialog";
import Button from "@/components/common/Button";
import LogMessage from "@/components/common/LogMessage";
import authClient from "@/lib/auth";

import {
    VerifyStatus,
    verifyButtonStrings,
    manageAccountStrings,
    verifyButtonColours
} from "@/apps/settings/constants/utils";

import PasswordResetDialogProps from "./PasswordResetDialogProps";
import * as styles from "./PasswordResetDialog.module.css";

function PasswordResetDialog({ onClose }: PasswordResetDialogProps) {
    const { t } = useTranslation(["settings", "common"]);

    const { profile } = useAuthedProfile();
    const getErrorMessage = useAuthErrors();
    
    const [ verifyStatus, setVerifyStatus ] = useState<VerifyStatus>("unsent");
    const [ verifyError, setVerifyError ] = useState<string>();

    const buttonMessages = useMemo(() => ({
        unsent: t(`${verifyButtonStrings}.unsent`),
        sending: t(`${verifyButtonStrings}.sending`),
        sent: t(`${verifyButtonStrings}.sent`)
    }), []);

    async function resetPassword() {
        if (!profile) return;

        setVerifyStatus("sending");

        const result = await authClient.requestPasswordReset({
            email: profile.email,
            redirectTo: "/auth/reset-password"
        });

        if (result.error) {
            setVerifyError(t(
                getErrorMessage(result.error.code),
                { ns: "common" }
            ));
            setVerifyStatus("unsent");

            return;
        }

        setVerifyStatus("sent");
    }

    return <Dialog className={styles.wrapper} onClose={onClose}>
        <span className={styles.message}>
            {t(`${manageAccountStrings}.resetPasswordDialog`)}
        </span>

        {verifyError && <LogMessage>
            {verifyError}
        </LogMessage>}

        <div className={styles.verificationButtonContainer}>
            <Button
                className={styles.verificationButton}
                style={{
                    backgroundColor: verifyButtonColours[verifyStatus],
                    cursor: verifyStatus == "unsent" ? "pointer" : "default"
                }}
                disabled={verifyStatus == "sending"}
                onClick={resetPassword}
            >
                {buttonMessages[verifyStatus]}
            </Button>
        </div>
    </Dialog>;
}

export default PasswordResetDialog;