import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { pick } from "lodash-es";

import displayToast from "@/lib/toast";

import * as styles from "./BugReportingWidget.module.css";

import iconInterfaceCopy from "@assets/img/interface/copy.svg";

const consoleMethods = ["log", "error", "warn", "info", "debug"] as const;
const originalConsole = pick(console, consoleMethods);

interface ConsoleLog {
    type: typeof consoleMethods[number];
    message: string;
}

function BugReportingWidget() {
    const { t } = useTranslation("common");

    const bugReportingLogsRef = useRef<ConsoleLog[]>([]);
    
    useEffect(() => {
        for (const method of consoleMethods) {
            console[method] = (log: any) => {
                bugReportingLogsRef.current.push({
                    type: method,
                    message: String(log)
                });

                originalConsole[method](log);
            };
        }
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