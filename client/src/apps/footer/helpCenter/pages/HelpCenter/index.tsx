import React from "react";
import { useTranslation } from "react-i18next";

import GameSelector from "@/components/chess/GameSelector";
import AnalyseButton from "@analysis/components/AnalyseButton";

import Header from "../../components/Header";
import * as styles from "./HelpCenter.module.css";

import iconInterfaceHelp from "@assets/img/interface/help.svg";
import iconHelpcenterMail from "@assets/img/helpCenter/mail.png";
import iconHelpcenterAnalysis from "@assets/img/helpCenter/analysis.png";

function HelpCenter() {
    const { t } = useTranslation("helpCenter");

    return <div className={styles.wrapper}>
        <Header
            image={iconInterfaceHelp}
            size="1.7rem"
        >
            {t("title")}
        </Header>

        <div className={styles.section}>
            <Header
                image={iconHelpcenterMail}
                size="1.3rem"
            >
                {t("contact.title")}
            </Header>

            <span>
                {t("contact.message")}
            </span>

            <a
                className={styles.importantValue}
                href="mailto:contact@wintrchess.com"
            >
                <b>contact@wintrchess.com</b>
            </a>
        </div>

        <div className={styles.section}>
            <Header
                image={iconHelpcenterAnalysis}
                size="1.3rem"
            >
                {t("analysis.title")}
            </Header>

            <div>
                <span>
                    {t("analysis.part1")}&ensp;

                    <a href="/analysis">
                        {t("analysis.part2")}
                    </a>
                </span>

                <span>
                    {t("analysis.part3")}
                </span>
            </div>

            <GameSelector style={{ width: "min(365px, 100%)" }}/>

            <span>
                {t("analysis.part4")}
            </span>

            <span>
                {t("analysis.part5")}
            </span>

            <AnalyseButton style={{ width: "min(365px, 100%)" }} />
        </div>
    </div>;
}

export default HelpCenter;