import React from "react";
import { useTranslation } from "react-i18next";

import Loader from "@/components/common/Loader";

import LoadingPlaceholderProps from "./LoadingPlaceholderProps";
import * as styles from "./LoadingPlaceholder.module.css";

function LoadingPlaceholder({ style }: LoadingPlaceholderProps) {
    const { t } = useTranslation("common");

    return <div
        className={styles.wrapper}
        style={style}
    >
        <Loader/>

        <span className={styles.message}>
            {t("loading")}
        </span>
    </div>;
}

export default LoadingPlaceholder;