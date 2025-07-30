import React from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";

import useSettingsStore from "@/stores/SettingsStore";
import SwitchSetting from "@/components/settings/SwitchSetting";

import * as styles from "../SettingsDialog.module.css";

function OtherOptionsArea() {
    const { t } = useTranslation("analysis");

    const { settings, setSettings } = useSettingsStore();

    return <>
        <span className={styles.header}>
            {t("settings.other.title")}
        </span>

        <div className={styles.setting}>
            <span data-tooltip-id="settings-other-simple-notation">
                {t("settings.other.simpleNotation")}
            </span>

            <Tooltip
                id="settings-other-simple-notation"
                delayShow={500}
                className={styles.settingDescription}
            >
                {t("settings.other.descriptions.simpleNotation")}
            </Tooltip>

            <SwitchSetting
                defaultChecked={settings.analysis.simpleNotation}
                onChange={checked => (
                    setSettings(draft => {
                        draft.analysis.simpleNotation = checked;
                        return draft;
                    })
                )}
            />
        </div>
    </>;
}

export default OtherOptionsArea;