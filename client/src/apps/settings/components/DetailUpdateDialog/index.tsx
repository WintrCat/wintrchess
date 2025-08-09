import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ButtonColour from "@/components/common/Button/Colour";
import Dialog from "@/components/common/Dialog";
import Button from "@/components/common/Button";
import TextField from "@/components/common/TextField";
import LogMessage from "@/components/common/LogMessage";

import DetailUpdateDialogProps from "./DetailUpdateDialogProps";
import * as settingsStyles from "../../index.module.css";
import * as styles from "./DetailUpdateDialog.module.css";

function DetailUpdateDialog({
    children,
    buttonStyle,
    placeholder,
    onClose,
    onConfirm,
    getErrorMessage,
    buttonDisabled,
    buttonDisabledOnError = true
}: DetailUpdateDialogProps) {
    const { t } = useTranslation("common");

    const [ input, setInput ] = useState("");
    const [ error, setError ] = useState<string>();

    useEffect(() => {
        setError(getErrorMessage?.(input));
    }, [input]);

    async function handleConfirmClick() {
        try {
            await onConfirm(input);
            onClose();
        } catch (err) {
            setError((err as Error).message);
        }
    }

    return <Dialog className={styles.wrapper} onClose={onClose}>
        <span className={styles.message}>
            {children}
        </span>

        <div className={settingsStyles.updateDialogInputContainer}>
            <TextField
                className={settingsStyles.inputField}
                placeholder={placeholder}
                value={input}
                onChange={setInput}
            />

            {error && <LogMessage className={styles.error}>
                {error}    
            </LogMessage>}
        </div>

        <div className={styles.confirmButtonContainer}>
            <Button
                className={styles.confirmButton}
                style={{
                    backgroundColor: ButtonColour.BLUE,
                    ...buttonStyle
                }}
                disabled={
                    (!!error && buttonDisabledOnError)
                    || buttonDisabled?.(input)
                }
                onClick={handleConfirmClick}
            >
                {t("confirm")}
            </Button>
        </div>
    </Dialog>;
}

export default DetailUpdateDialog;