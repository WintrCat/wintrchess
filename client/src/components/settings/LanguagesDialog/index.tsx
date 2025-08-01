import React from "react";
import { useTranslation } from "react-i18next";

import LocalStorageKey from "@/constants/LocalStorageKey";
import Dialog from "@/components/common/Dialog";
import languages from "@/i18n/languages";

import LanguagesDialogProps from "./LanguagesDialogProps";
import * as styles from "./LanguagesDialog.module.css";

function LanguagesDialog({ onClose }: LanguagesDialogProps) {
    const { t, i18n } = useTranslation("common");

    function setLanguage(id: string) {
        i18n.changeLanguage(id);
        localStorage.setItem(LocalStorageKey.PREFERRED_LANGUAGE, id);
    }

    return <Dialog className={styles.wrapper} onClose={onClose}>
        <span className={styles.title}>
            {t("footer.languagesDialog.select")}
        </span>

        <div className={styles.languages}>
            {languages.map(lang => <div
                key={lang.id}
                className={styles.language}
                onClick={() => setLanguage(lang.id)}
            >
                {lang.label}
            </div>)}
        </div>

        <a
            className={styles.helpLink}
            href="https://crowdin.com/project/wintrchess"
        >
            {t("footer.languagesDialog.help")}
        </a>
    </Dialog>;
}

export default LanguagesDialog;