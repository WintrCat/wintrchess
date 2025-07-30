import React from "react";
import { useTranslation } from "react-i18next";

import useSettingsStore from "@/stores/SettingsStore";
import SwitchSetting from "@/components/settings/SwitchSetting";

import * as categoryStyles from "../Category.module.css";

function BugReporting() {
    const { t } = useTranslation("settings");

    const { settings, setSettings } = useSettingsStore();

    return <div className={categoryStyles.wrapper}>
        <b className={categoryStyles.header}>
            {t("bugReporting.bugReportingMode")}
        </b>

        <span style={{ color: "gray" }}>
            {t("bugReporting.bugReportingModeDescription")}
        </span>

        <div className={categoryStyles.setting}>
            <span>
                {t("bugReporting.bugReportingMode")}
            </span>

            <SwitchSetting
                defaultChecked={settings.bugReportingMode}
                onChange={checked => (
                    setSettings(draft => {
                        draft.bugReportingMode = checked;
                        return draft;
                    })
                )}
            />
        </div>
    </div>;
}

export default BugReporting;