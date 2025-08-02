import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";
import { floor, clamp } from "lodash-es";

import EngineVersion from "shared/constants/EngineVersion";
import EngineArrowType from "@analysis/constants/EngineArrowType";
import useSettingsStore from "@/stores/SettingsStore";
import LogMessage from "@/components/common/LogMessage";
import DropdownSetting from "@/components/settings/DropdownSetting";
import NumberSetting from "@/components/settings/NumberSetting";
import SwitchSetting from "@/components/settings/SwitchSetting";

import * as styles from "../SettingsDialog.module.css";

const engineVersionOptions = [
    {
        label: "Stockfish 17 (68 MB)",
        value: EngineVersion.STOCKFISH_17
    },
    {
        label: "Stockfish 17 Lite (Recommended)",
        value: EngineVersion.STOCKFISH_17_LITE
    },
    {
        label: "Stockfish 17 (Compatibility)",
        value: EngineVersion.STOCKFISH_17_ASM
    }
];

function EngineOptionsArea() {
    const { t, i18n } = useTranslation(["analysis", "common"]);

    const { settings, setSettings } = useSettingsStore();

    const engineArrowsOptions = useMemo(() => [
        {
            label: t("disabled", { ns: "common" }),
            value: EngineArrowType.DISABLED
        },
        {
            label: t("settings.engine.suggestionArrows.continuation"),
            value: EngineArrowType.TOP_CONTINUATION
        },
        {
            label: t("settings.engine.suggestionArrows.alternative"),
            value: EngineArrowType.TOP_ALTERNATIVE
        }
    ], [i18n.language]);

    return <>
        <span className={styles.header}>
            {t("settings.engine.title")}
        </span>

        <span className={styles.setting}>
            <span>{t("enabled", { ns: "common" })}</span>

            <SwitchSetting
                defaultChecked={settings.analysis.engine.enabled}
                onChange={checked => (
                    setSettings(draft => {
                        draft.analysis.engine.enabled = checked;
                        return draft;
                    })
                )}
            />
        </span>

        <div className={styles.setting}>
            <span data-tooltip-id="settings-engine-version">
                {t("settings.engine.version")}
            </span>

            <Tooltip
                id="settings-engine-version"
                content={t("settings.engine.descriptions.version")}
                delayShow={500}
                className={styles.settingDescription}
            />

            <DropdownSetting
                options={engineVersionOptions}
                defaultValue={engineVersionOptions.find(
                    option => option.value == settings.analysis.engine.version
                )}
                onSelect={option => {
                    if (!option) return;

                    setSettings(draft => {
                        draft.analysis.engine.version = option.value;
                        return draft;
                    });
                }}
                dropdownStyle={{ width: "180px" }}
            />
        </div>

        <div className={styles.setting}>
            <span data-tooltip-id="settings-engine-depth">
                {t("settings.engine.depth")}
            </span>

            <Tooltip
                id="settings-engine-depth"
                content={t("settings.engine.descriptions.depth")}
                delayShow={500}
                className={styles.settingDescription}
            />

            <NumberSetting
                min={10}
                max={99}
                defaultValue={settings.analysis.engine.depth}
                onChange={value => (
                    setSettings(draft => {
                        draft.analysis.engine.depth = floor(
                            clamp(value, 10, 99)
                        );
                        return draft;
                    })
                )}
                style={{ width: "180px" }}
            />
        </div>

        <div className={styles.setting}>
            <span data-tooltip-id="settings-engine-lines">
                {t("settings.engine.lines")}
            </span>

            <Tooltip
                id="settings-engine-lines"
                content={t("settings.engine.descriptions.lines")}
                delayShow={500}
                className={styles.settingDescription}
            />

            <NumberSetting
                min={0}
                max={5}
                defaultValue={settings.analysis.engine.lines}
                onChange={value => (
                    setSettings(draft => {
                        draft.analysis.engine.lines = floor(
                            clamp(value, 1, 5)
                        );
                        return draft;
                    })
                )}
                style={{ width: "180px" }}
            />
        </div>

        {settings.analysis.engine.lines < 2
            && <LogMessage theme="warn">
                {t("settings.engine.linesWarning")}
            </LogMessage>
        }

        <div className={styles.setting}>
            <span data-tooltip-id="settings-engine-time-limit">
                {t("settings.engine.timeLimit")}
            </span>

            <Tooltip
                id="settings-engine-time-limit"
                content={t("settings.engine.descriptions.timeLimit")}
                delayShow={500}
                className={styles.settingDescription}
            />

            <div className={styles.subsetting}>
                <SwitchSetting
                    defaultChecked={settings.analysis.engine.timeLimitEnabled}
                    onChange={checked => (
                        setSettings(draft => {
                            draft.analysis.engine.timeLimitEnabled = checked;
                            return draft;
                        })
                    )}
                />

                <NumberSetting
                    min={0.01}
                    defaultValue={settings.analysis.engine.timeLimit}
                    onChange={value => (
                        setSettings(draft => {
                            draft.analysis.engine.timeLimit = floor(
                                Math.max(0.01, value), 2
                            );
                            return draft;
                        })
                    )}
                    style={{ width: "180px" }}
                />
            </div>
        </div>

        <div className={styles.setting}>
            <span data-tooltip-id="settings-engine-suggestion-arrows">
                {t("settings.engine.suggestionArrows.title")}
            </span>

            <Tooltip
                id="settings-engine-suggestion-arrows"
                delayShow={500}
                className={styles.settingDescription}
            >
                {t("settings.engine.descriptions.suggestionArrows.disabled")}
                <br/><br/>
                {t("settings.engine.descriptions.suggestionArrows.continuation")}
                <br/><br/>
                {t("settings.engine.descriptions.suggestionArrows.alternative")}
            </Tooltip>

            <DropdownSetting
                defaultValue={engineArrowsOptions.find(option => (
                    option.value == settings.analysis.engine.suggestionArrows
                ))}
                options={engineArrowsOptions}
                onSelect={option => {
                    if (!option) return;

                    setSettings(draft => {
                        draft.analysis.engine.suggestionArrows = option.value;
                        return draft;
                    });
                }}
                dropdownStyle={{ width: "180px" }}
            />
        </div>
    </>;
}

export default EngineOptionsArea;