import React, { lazy, Suspense, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PageWrapper from "@/components/layout/PageWrapper";
import LoadingPlaceholder from "@/components/layout/LoadingPlaceholder";
import { removeDefaultConsentLink } from "@/lib/consent";

const ArticleList = lazy(() => import("./pages/ArticleList"));
const Article = lazy(() => import("./pages/Article"));

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
                    <Route path="/news" element={<ArticleList/>} />
                    <Route path="/news/:articleId" element={<Article/>} />
                </Routes>
            </Suspense>
        </PageWrapper>
    </BrowserRouter>;
}

root.render(<App/>);