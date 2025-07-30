import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Hook, Unhook } from "console-feed";

import displayToast from "@/lib/toast";

import * as styles from "./BugReportingWidget.module.css";

import iconInterfaceCopy from "@assets/img/interface/copy.svg";

function BugReportingWidget() {
    const { t } = useTranslation("common");

    const bugReportingLogsRef = useRef<any[]>([]);
    
    useEffect(() => {
        const hookedConsole = Hook(
            console,
            log => bugReportingLogsRef.current.push(log),
            false
        );

        return () => {
            Unhook(hookedConsole);
        };
    }, []);

    return <div
        className={styles.bugReportWidget}
        title={t("bugReportWidget.tooltip")}
        onClick={() => {
            navigator.clipboard.writeText(
                JSON.stringify(bugReportingLogsRef.current, undefined, 4)
            );

            displayToast({
                message: t("bugReportWidget.toast"),
                theme: "success"
            });
        }}
    >
        <img src={iconInterfaceCopy} />
    </div>;
}

export default BugReportingWidget;