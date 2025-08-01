import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import useSettingsStore, { defaultSettings } from "@/stores/SettingsStore";
import BoardColourPreset from "@/apps/settings/components/BoardColourPreset";
import ColourSwatch from "@/components/settings/ColourSwatch";
import Button from "@/components/common/Button";
import Separator from "@/components/common/Separator";

import * as categoryStyles from "../Category.module.css";
import * as styles from "./BoardAndPieces.module.css";

import iconInterfaceDelete from "@assets/img/interface/delete.svg";

const boardColourPresets = [
    { light: "#f0d9b5", dark: "#b58863", name: "wooden" },
    { light: "#ebedd1", dark: "#729452", name: "tournament" },
    { light: "#eae8d3", dark: "#4b7298", name: "blue" },
    { light: "#d9e4e8", dark: "#83a5b6", name: "ice" },
    { light: "#f5f1f0", dark: "#f8c8dc", name: "marshmallow" },
    { light: "#b6b8e1", dark: "#9c9fd9", name: "pillow" }
];

function BoardAndPieces() {
    const { t } = useTranslation(["settings", "common"]);

    const { settings, setSettings } = useSettingsStore();

    const [
        lightSquareColourSwatchOpen,
        setLightSquareColourSwatchOpen
    ] = useState(false);

    const [
        darkSquareColourSwatchOpen,
        setDarkSquareColourSwatchOpen
    ] = useState(false);

    function setBoardColours(light: string, dark: string) {
        setSettings(draft => {
            draft.themes.board.lightSquareColour = light;
            draft.themes.board.darkSquareColour = dark;

            return draft;
        });
    }

    return <div
        className={categoryStyles.wrapper}
        onClick={event => {
            setLightSquareColourSwatchOpen(false);
            setDarkSquareColourSwatchOpen(false);

            event.stopPropagation();
        }}
    >
        <b className={categoryStyles.header}>
            {t("boardAndPieces.boardColour")}
        </b>

        <Separator className={categoryStyles.separator} />

        <div className={categoryStyles.setting}>
            <span>
                {t("boardAndPieces.lightSquareColour")}
            </span>

            <ColourSwatch
                colour={settings.themes.board.lightSquareColour}
                onColourChange={colour => {
                    setSettings(draft => {
                        draft.themes.board.lightSquareColour = colour;
                        return draft;
                    });
                }}
                open={lightSquareColourSwatchOpen}
                onToggle={setLightSquareColourSwatchOpen}
            />
        </div>

        <div className={categoryStyles.setting}>
            <span>
                {t("boardAndPieces.darkSquareColour")}
            </span>

            <ColourSwatch
                colour={settings.themes.board.darkSquareColour}
                onColourChange={colour => {
                    setSettings(draft => {
                        draft.themes.board.darkSquareColour = colour;
                        return draft;
                    });
                }}
                open={darkSquareColourSwatchOpen}
                onToggle={setDarkSquareColourSwatchOpen}
            />
        </div>

        <Button
            icon={iconInterfaceDelete}
            onClick={() => setBoardColours(
                defaultSettings.themes.board.lightSquareColour,
                defaultSettings.themes.board.darkSquareColour
            )}
        >
            {t("reset", { ns: "common" })}
        </Button>

        <b className={categoryStyles.subheader}>
            {t("boardAndPieces.presetsTitle")}
        </b>

        <div className={styles.presets}>
            {boardColourPresets.map(preset => <BoardColourPreset
                key={preset.name}
                lightSquareColour={preset.light}
                darkSquareColour={preset.dark}
                title={t(
                    `boardAndPieces.presets.${preset.name}`
                )}
                selected={
                    settings.themes.board.lightSquareColour == preset.light
                    && settings.themes.board.darkSquareColour == preset.dark
                }
                onClick={() => setBoardColours(preset.light, preset.dark)}
            />)}
        </div>
    </div>;
}

export default BoardAndPieces;