import React, { lazy, Suspense, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import Typography from "@/components/Typography";
import Dialog from "@/components/common/Dialog";
import LoadingPlaceholder from "../LoadingPlaceholder";
import { manageDataConsent } from "@/lib/consent";

import FooterProps from "./FooterProps";
import * as styles from "./Footer.module.css";

const LanguagesDialog = lazy(() => import(
    "@/components/settings/LanguagesDialog"
));

function LoadingDialog() {
    return <Dialog>
        <LoadingPlaceholder/>
    </Dialog>;
}

function Footer({ className, style }: FooterProps) {
    const { t } = useTranslation(["common", "helpCenter"]);

    const copyrightYear = useMemo(() => (
        new Date().getFullYear()
    ), []);

    const [ languagesOpen, setLanguagesOpen ] = useState(false);

    return <footer
        className={`${styles.wrapper} ${className}`}
        style={style}
    >
        <div className={styles.section}>
            <Typography
                iconClassName={styles.typographyIcon}
                textClassName={styles.typographyText}
                includeIcon
            />

            <span className={styles.copyrightNotice}>
                Copyright © {copyrightYear} wintrchess.com
            </span>

            <span className={styles.copyrightNotice}>
                All rights reserved
            </span>
        </div>

        <div className={styles.links}>
            <div className={styles.section}>
                <a href="/help">
                    {t("title", { ns: "helpCenter" })}
                </a>

                <span className={styles.link} onClick={manageDataConsent}>
                    {t("footer.privacySettings")}
                </span>

                <span
                    className={styles.link}
                    onClick={() => setLanguagesOpen(true)}
                >
                    {t("footer.language")}
                </span>
            </div>

            <div className={styles.section}>
                <a href="/terms">
                    {t("footer.termsOfService")}
                </a>

                <a href="/privacy">
                    {t("footer.privacyPolicy")}
                </a>

                <a href="https://github.com/WintrCat/wintrchess">
                    {t("footer.openSource")}
                </a>
            </div>
        </div>

        <Suspense fallback={<LoadingDialog/>}>
            {languagesOpen && <LanguagesDialog
                onClose={() => setLanguagesOpen(false)}
            />}
        </Suspense>
    </footer>;
}

export default Footer;