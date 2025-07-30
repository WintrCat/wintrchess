import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PageWrapper from "@/components/layout/PageWrapper";
import PasswordDialog from "./components/PasswordDialog";
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

    return <PageWrapper contentClassName={styles.content}>
        <BrowserRouter>
            <Routes>
                <Route
                    path="/auth/reset-password"
                    element={<PasswordDialog/>}
                />
            </Routes>
        </BrowserRouter>
    </PageWrapper>;
}

root.render(<App/>);