import React, { lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import PageWrapper from "@/components/layout/PageWrapper";
import "@/i18n";
import "@/index.css";

import * as styles from "./index.module.css";

const Learn = lazy(() => import("./pages/Learn"));

const root = ReactDOM.createRoot(
    document.querySelector(".root")!
);

function App() {
    return <BrowserRouter>
        <PageWrapper
            className={styles.wrapper}
            footerClassName={styles.footer}
        >
            <Routes>
                <Route path="/learn" element={<Learn/>} />
            </Routes>
        </PageWrapper>
    </BrowserRouter>;
}

root.render(<App/>);
