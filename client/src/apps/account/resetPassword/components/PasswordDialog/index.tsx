import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import schemas from "shared/constants/account/schemas";
import { validate } from "shared/lib/utils/validate";
import useAuthErrors from "@/hooks/auth/useAuthErrors";
import ButtonColour from "@/components/common/Button/Colour";
import TextField from "@/components/common/TextField";
import Button from "@/components/common/Button";
import LogMessage from "@/components/common/LogMessage";
import StatusMessage from "@/components/common/LogMessage/StatusMessage";
import authClient from "@/lib/auth";

import * as styles from "../../index.module.css";

function PasswordDialog() {
    const { t } = useTranslation(["common", "otherPages"]);

    const [ searchParams ] = useSearchParams();

    const getErrorMessage = useAuthErrors();

    const [ password, setPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");

    const [ status, setStatus ] = useState<StatusMessage>();

    async function resetPassword() {
        const token = searchParams.get("token");

        if (!token) return setStatus({
            theme: "error",
            message: t("unknownError")
        });

        if (password != confirmPassword)
            return setStatus({
                theme: "error",
                message: t("account.errors.passwordNoMatch")
            });

        const validationErrorCode = validate(password, schemas.password);

        if (validationErrorCode) return setStatus({
            theme: "error",
            message: getErrorMessage(validationErrorCode)
        });

        const result = await authClient.resetPassword({
            token, newPassword: password
        });

        if (result.error) return setStatus({
            theme: "error",
            message: getErrorMessage(result.error.code)
        });

        location.href = "/signin";
    }

    return <div className={styles.updateDialog}>
        <span className={styles.message}>
            {t("resetPassword.message", { ns: "otherPages" })}
        </span>

        <TextField
            className={styles.field}
            placeholder={t("account.placeholders.password")}
            password
            value={password}
            onChange={setPassword}
        />

        <TextField
            className={styles.field}
            placeholder={t("account.placeholders.confirmPassword")}
            password
            value={confirmPassword}
            onChange={setConfirmPassword}
        />

        {status && <LogMessage theme={status.theme}>
            {status.message}
        </LogMessage>}

        <Button
            style={{ backgroundColor: ButtonColour.BLUE }}
            onClick={resetPassword}
        >
            {t("confirm")}
        </Button>
    </div>;
}

export default PasswordDialog;