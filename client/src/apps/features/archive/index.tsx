import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";

import ads from "@/constants/advertisements";
import PageWrapper from "@/components/layout/PageWrapper";
import Advertisement from "@/components/Advertisement";
import Archive from "./pages/Archive";
import { removeDefaultConsentLink } from "@/lib/consent";

import "@/i18n";
import "@/index.css";

import * as styles from "./index.module.css";

const root = ReactDOM.createRoot(
    document.querySelector(".root")!
);

function App() {
    useEffect(() => {
        removeDefaultConsentLink();
    }, []);

    return <PageWrapper contentClassName={styles.wrapper}>
        <Archive/>

        <div className={styles.advertisement}>
            <Advertisement adUnitId={ads.archive} style={{
                width: "100%", height: "100px"
            }}/>
        </div>
    </PageWrapper>;
}

root.render(<App/>);