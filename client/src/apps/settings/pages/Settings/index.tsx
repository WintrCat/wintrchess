import React, { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";

import { useAuthedProfile } from "@/hooks/api/useProfile";
import LoadingPlaceholder from "@/components/layout/LoadingPlaceholder";
import CategoryTab from "@/apps/settings/components/CategoryTab";
import { manageDataConsent } from "@/lib/consent";

import * as styles from "./Settings.module.css";

import iconIconsSettings from "@assets/img/icons/settings.png";

function Settings() {
    const { t } = useTranslation(["settings", "common", "helpCenter"]);

    const navigate = useNavigate();

    const { status } = useAuthedProfile();

    return <div className={styles.wrapper}>
        <div className={styles.titleContainer}>
            <img src={iconIconsSettings} />

            <span>{t("settings", { ns: "common" })}</span>
        </div>

        <div className={styles.settingsContainer}>
            <div className={styles.settings}>
                <Suspense fallback={<LoadingPlaceholder/>}>
                    <Outlet/>
                </Suspense>
            </div>

            <div className={styles.categories}>
                {status == "success" && <CategoryTab
                    active={location.pathname.includes("/settings/account")}
                    onClick={() => navigate("/settings/account")}
                >
                    {t("account.title")}
                </CategoryTab>}

                <CategoryTab
                    active={location.pathname.includes("/settings/theme")}
                    onClick={() => navigate("/settings/theme")}
                >
                    {t("boardAndPieces.title")}
                </CategoryTab>

                <CategoryTab
                    active={location.pathname.includes("/settings/bugs")}
                    onClick={() => navigate("/settings/bugs")}
                >
                    {t("bugReporting.title")}
                </CategoryTab>

                <hr className={styles.separator} />

                <CategoryTab onClick={manageDataConsent}>
                    {t("privacy")}
                </CategoryTab>

                <CategoryTab onClick={() => {
                    location.href = "/help";
                }}>
                    {t("title", { ns: "helpCenter" })}
                </CategoryTab>
            </div>
        </div>
    </div>;
}

export default Settings;