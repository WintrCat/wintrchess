import React from "react";
import { useTranslation } from "react-i18next";

import { Classification } from "shared/constants/Classification";
import { classificationNames } from "@analysis/constants/classifications";
import useSettingsStore from "@/stores/SettingsStore";
import SwitchSetting from "@/components/settings/SwitchSetting";

import * as styles from "../SettingsDialog.module.css";

import iconClassificationsBrilliant from "@assets/img/classifications/brilliant.png";
import iconClassificationsCritical from "@assets/img/classifications/critical.png";
import iconClassificationsTheory from "@assets/img/classifications/theory.png";

function ClassificationOptionsArea() {
    const { t } = useTranslation("analysis");

    const { settings, setSettings } = useSettingsStore();

    return <>
        <span className={styles.header}>
            {t("settings.classifications.title")}
        </span>

        <div className={styles.setting}>
            <span>{t("settings.classifications.hide")}</span>

            <SwitchSetting
                defaultChecked={settings.analysis.classifications.hide}
                onChange={checked => (
                    setSettings(draft => {
                        draft.analysis.classifications.hide = checked;
                        return draft;
                    })
                )}
            />
        </div>

        <div className={styles.setting}>
            <div className={styles.subsetting}>
                <img
                    className={styles.settingIcon}
                    src={iconClassificationsBrilliant}
                />

                <span>
                    {t(classificationNames[Classification.BRILLIANT])}
                </span>
            </div>

            <SwitchSetting
                defaultChecked={
                    settings.analysis.classifications.included.brilliant
                }
                onChange={checked => (
                    setSettings(draft => {
                        draft.analysis.classifications.included.brilliant = checked;
                        return draft;
                    })
                )}
            />
        </div>

        <div className={styles.setting}>
            <div className={styles.subsetting}>
                <img
                    className={styles.settingIcon}
                    src={iconClassificationsCritical}
                />

                <span>
                    {t(classificationNames[Classification.CRITICAL])}
                </span>
            </div>

            <SwitchSetting
                defaultChecked={
                    settings.analysis.classifications.included.critical
                }
                disabled={settings.analysis.engine.lines < 2}
                onChange={checked => (
                    setSettings(draft => {
                        draft.analysis.classifications.included.critical = checked;
                        return draft;
                    })
                )}
            />
        </div>

        <div className={styles.setting}>
            <div className={styles.subsetting}>
                <img
                    className={styles.settingIcon}
                    src={iconClassificationsTheory}
                />

                <span>
                    {t("settings.classifications.theory")}
                </span>
            </div>

            <SwitchSetting
                defaultChecked={settings.analysis.classifications.included.theory}
                onChange={checked => (
                    setSettings(draft => {
                        draft.analysis.classifications.included.theory = checked;
                        return draft;
                    })
                )}
            />
        </div>
    </>;
}

export default ClassificationOptionsArea;