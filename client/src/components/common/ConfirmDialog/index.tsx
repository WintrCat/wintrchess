import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import Dialog from "../Dialog";
import Button from "../Button";
import ButtonColour from "@/components/common/Button/Colour";

import ConfirmDialogProps from "./ConfirmDialogProps";
import * as styles from "./ConfirmDialog.module.css";

function ConfirmDialog({
    onClose,
    children,
    dangerAction,
    onConfirm
}: ConfirmDialogProps) {
    const { t } = useTranslation("common");

    const [ pending, setPending ] = useState(false);

    return <Dialog
        className={styles.dialog}
        onClose={onClose}     
    >
        {children}

        <div className={styles.options}>
            <Button
                style={{
                    padding: "10px 20px",
                    backgroundColor: dangerAction ?
                        ButtonColour.RED
                        : ButtonColour.BLUE
                }}
                onClick={async () => {
                    setPending(true);
                    await onConfirm();
                    setPending(false);
                    onClose();
                }}
                disabled={pending}
            >
                {t("confirmDialog.yes")}
            </Button>

            <Button
                onClick={onClose}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#242424"
                }}
            >
                {t("confirmDialog.no")}
            </Button>
        </div>
    </Dialog>;
}

export default ConfirmDialog;