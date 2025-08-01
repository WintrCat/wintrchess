import React, { lazy, Suspense, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PageWrapper from "@/components/layout/PageWrapper";
import LoadingPlaceholder from "@/components/layout/LoadingPlaceholder";
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

    return <BrowserRouter>
        <PageWrapper>
            <Suspense fallback={<LoadingPlaceholder/>}>
                <Routes>
                    <Route path="/signup" element={<SignUp/>} />
                    <Route path="/signin" element={<SignIn/>} />
                </Routes>
            </Suspense>
        </PageWrapper>
    </BrowserRouter>;
}

root.render(<App/>);