import React, { lazy, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PageWrapper from "@/components/layout/PageWrapper";
import Settings from "./pages/Settings";
import { removeDefaultConsentLink } from "@/lib/consent";

const AccountSection = lazy(() => import("./components/categories/Account"));

const BoardAndPiecesSection = lazy(
    () => import("./components/categories/BoardAndPieces")
);

const BugReportingSection = lazy(
    () => import("./components/categories/BugReporting")
);

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

    return <PageWrapper contentClassName={styles.content}>
        <BrowserRouter>
            <Routes>
                <Route path="/settings" element={<Settings/>}>
                    <Route index element={<Navigate to="/settings/theme"/>} />

                    <Route path="/settings/account" element={<AccountSection/>} />
                    <Route path="/settings/theme" element={<BoardAndPiecesSection/>} />
                    <Route path="/settings/bugs" element={<BugReportingSection/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    </PageWrapper>;
}

root.render(<App/>);