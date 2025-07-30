import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuthedProfile } from "@/hooks/api/useProfile";
import useAuthErrors from "@/hooks/auth/useAuthErrors";
import ButtonColour from "@/components/common/Button/Colour";
import Button from "@/components/common/Button";
import PasswordResetDialog from "@/apps/settings/components/PasswordResetDialog";
import DetailUpdateDialog from "@/apps/settings/components/DetailUpdateDialog";
import authClient from "@/lib/auth";

import { manageAccountStrings } from "@/apps/settings/constants/utils";

import * as styles from "./ManageAccount.module.css";

function ManageAccount() {
    const { t } = useTranslation("settings");

    const { profile } = useAuthedProfile();

    const getErrorMessage = useAuthErrors();

    const [
        resetPasswordDialogOpen,
        setResetPasswordDialogOpen
    ] = useState(false);

    const [
        deleteAccountDialogOpen,
        setDeleteAccountDialogOpen
    ] = useState(false);

    async function deleteAccount() {
        const result = await authClient.deleteUser();

        if (result.error) throw new Error(
            t(getErrorMessage(result.error.code))
        );

        location.href = "/signup";
    }

    return <div className={styles.wrapper}>
        <Button
            className={styles.accountButton}
            style={{ backgroundColor: ButtonColour.BLUE }}
            onClick={() => setResetPasswordDialogOpen(true)}
        >
            {t(`${manageAccountStrings}.resetPassword`)}
        </Button>

        {resetPasswordDialogOpen && <PasswordResetDialog
            onClose={() => setResetPasswordDialogOpen(false)}
        />}

        <Button
            className={styles.accountButton}
            style={{ backgroundColor: ButtonColour.RED }}
            onClick={() => setDeleteAccountDialogOpen(true)}
        >
            {t(`${manageAccountStrings}.deleteAccount`)}
        </Button>

        {deleteAccountDialogOpen && <DetailUpdateDialog
            buttonStyle={{ backgroundColor: ButtonColour.RED }}
            onClose={() => setDeleteAccountDialogOpen(false)}
            onConfirm={deleteAccount}
            buttonDisabled={input => input != profile?.username}
            placeholder={`${profile?.username}...`}
        >
            <div className={styles.deleteAccountDialogMessage}>
                <span>{t(`${manageAccountStrings}.deleteAccountDialog`)}</span>

                <span className={styles.deleteAccountConfirmation}>
                    {profile?.username}
                </span>

                <span>{t(`${manageAccountStrings}.irreversibleAction`)}</span>
            </div>
        </DetailUpdateDialog>}
    </div>;
}

export default ManageAccount;