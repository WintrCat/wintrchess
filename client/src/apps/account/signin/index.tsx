import React, { lazy, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import PageWrapper from "@/components/layout/PageWrapper";
import LogMessage from "@/components/common/LogMessage";
import { removeDefaultConsentLink } from "@/lib/consent";

const SignUp = lazy(() => import("./pages/SignUp"));
const SignIn = lazy(() => import("./pages/SignIn"));

import "@/i18n";
import "@/index.css";

const root = ReactDOM.createRoot(
    document.querySelector(".root")!
);

function App() {
    useEffect(() => {
        removeDefaultConsentLink();
    }, []);

    if (!process.env.GOOGLE_OAUTH_CLIENT_ID) {
        return <LogMessage>
            Google OAuth Client ID not specified.
        </LogMessage>;
    }

    return <GoogleOAuthProvider clientId={process.env.GOOGLE_OAUTH_CLIENT_ID}>
        <BrowserRouter>
            <PageWrapper>
                <Routes>
                    <Route path="/signup" element={<SignUp/>} />
                    <Route path="/signin" element={<SignIn/>} />
                </Routes>
            </PageWrapper>
        </BrowserRouter>
    </GoogleOAuthProvider>;
}

root.render(<App/>);