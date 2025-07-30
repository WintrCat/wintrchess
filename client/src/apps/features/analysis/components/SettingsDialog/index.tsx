import React from "react";
import { useTranslation } from "react-i18next";

import Dialog from "@/components/common/Dialog";

import EngineOptionsArea from "./EngineOptionsArea";
import ClassificationOptionsArea from "./ClassificationOptionsArea";
import OtherOptionsArea from "./OtherOptionsArea";

import SettingsDialogProps from "./SettingsDialogProps";
import * as styles from "./SettingsDialog.module.css";

import iconIconsEngine from "@assets/img/icons/engine.png";

function SettingsDialog({ onClose }: SettingsDialogProps) {
    const { t } = useTranslation("analysis");

    return <Dialog
        className={styles.settingsDialog}
        onClose={onClose}
    >
        <div className={styles.header} style={{ paddingRight: "50px" }}>
            <img
                src={iconIconsEngine}
                height={30}
            />

            <span style={{ fontFamily: "Nunito" }}>
                {t("settings.title")}
            </span>
        </div>

        <div className={styles.content}>
            <EngineOptionsArea/>

            <ClassificationOptionsArea/>

            <OtherOptionsArea/>
        </div>
    </Dialog>;
}

export default SettingsDialog;