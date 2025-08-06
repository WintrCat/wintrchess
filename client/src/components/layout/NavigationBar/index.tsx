import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";

import { useAuthedProfile } from "@/hooks/api/useProfile";
import Typography from "@/components/Typography";
import Button from "@/components/common/Button";
import BlurBackground from "@/components/layout/BlurBackground";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import authClient from "@/lib/auth";

import HoverDropdown from "./HoverDropdown";
import * as styles from "./NavigationBar.module.css";

import iconInterfaceMenu from "@assets/img/interface/menu.svg";
import iconIconsAnalysis from "@assets/img/icons/analysis.png";
import iconIconsArchive from "@assets/img/icons/archive.png";
import iconIconsNews from "@assets/img/icons/news.png";
import iconKofi from "@assets/img/kofi.svg";
import iconInterfaceSettings from "@assets/img/interface/settings.svg";
import iconInterfaceSignin from "@assets/img/interface/sign_in.svg";
import iconInterfaceAccount from "@assets/img/interface/account.svg";
import iconIconsSettings from "@assets/img/icons/settings.png";

function NavigationBar() {
    const { t } = useTranslation("common"); 

    const { profile, status } = useAuthedProfile();

    const [ sidebarOpen, setSidebarOpen ] = useState(false);

    async function signOut() {
        await authClient.signOut();
        location.href = "/signin";
    }

    return <div className={styles.wrapper}>
        <div className={styles.section}>
            <div className={styles.section}>
                <img
                    className={styles.menuButton}
                    src={iconInterfaceMenu}
                    height={35}
                    onClick={() => setSidebarOpen(true)}
                />

                <Typography
                    textClassName={styles.typographyText}
                    includeIcon
                />
            </div>

            <div className={styles.tabs}>
                <HoverDropdown
                    icon={iconIconsAnalysis}
                    url="/analysis"
                >
                    {t("sidebar.analysis")}
                </HoverDropdown>

                <HoverDropdown
                    icon={iconIconsArchive}
                    url="/archive"
                >
                    {t("sidebar.archive")}
                </HoverDropdown>

                <HoverDropdown
                    icon={iconIconsNews}
                    url="/news"
                >
                    {t("sidebar.news")}
                </HoverDropdown>
            </div>
        </div>

        <div className={styles.section}>
            <a href="https://ko-fi.com/wintrcat" target="_blank">
                <Button
                    className={styles.support}
                    icon={iconKofi}
                    tooltipId="navigation-bar-support"
                />
            </a>

            <Tooltip
                id="navigation-bar-support"
                content={t("navigationBar.tooltips.support")}
                delayShow={500}
            />

            {status == "pending" && <span>
                {t("loading")}
            </span>}

            {status == "success" && <HoverDropdown
                dropdownClassName={styles.profileMenu}
                menuPosition="right"
                openStrategy="click"
                options={[
                    // {
                    //     icon: iconInterfaceAccount,
                    //     label: t("navigationBar.profileMenu.profile"),
                    //     url: `/profile/${profile.username}`
                    // },
                    {
                        icon: iconInterfaceSettings,
                        label: t("settings"),
                        url: "/settings"
                    },
                    {
                        icon: iconInterfaceSignin,
                        label: t("navigationBar.profileMenu.signOut"),
                        onClick: signOut
                    }
                ]}
            >
                <span className={styles.profileUsername}>
                    {profile.username}
                </span>

                <img
                    className={styles.profileIcon}
                    src={iconInterfaceAccount}
                />

                {/* <div className={styles.profileImage} /> */}
            </HoverDropdown>}

            {status == "error" && <>
                <a href="/signin">
                    <Button
                        className={styles.signIn}
                        icon={iconInterfaceSignin}
                        iconSize="28px"
                    >
                        {t("navigationBar.signIn")}
                    </Button>
                </a>

                <a href="/settings">
                    <Button
                        className={styles.settings}
                        icon={iconIconsSettings}
                        iconSize="28px"
                    />
                </a>
            </>}
        </div>

        {sidebarOpen && <BlurBackground
            style={{ zIndex: 1000 }}
            onClick={() => setSidebarOpen(false)}
        />}

        <Sidebar
            style={{
                zIndex: 1001,
                transition: "left 0.3s ease",
                left: sidebarOpen ? "0" : "-320px"
            }}
            onClose={() => setSidebarOpen(false)}
        />
    </div>;
}

export default NavigationBar;