import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

import LoadingPlaceholder from "@/components/layout/LoadingPlaceholder";

const Login = lazy(() => import("./pages/Login"));

const Dashboard = lazy(() => import("./pages/Dashboard"));
const AnnouncementEditor = lazy(() => import("./pages/AnnouncementEditor"));

const ArticleList = lazy(() => import("./pages/news/ArticleList"));
const ArticleEditor = lazy(() => import("./pages/news/ArticleEditor"));

import "../../i18n";
import "@/index.css";

const root = ReactDOM.createRoot(
    document.querySelector(".root")!
);

const queryClient = new QueryClient();

function App() {
    return <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <Suspense fallback={
                <LoadingPlaceholder style={{ height: "100vh" }} />
            }>
                <Routes>
                    <Route path="/internal/login" element={<Login/>} />

                    <Route path="/internal/dashboard" element={<Dashboard/>}>
                        <Route index element={
                            <Navigate to="/internal/dashboard/news"/>
                        }/>

                        <Route path="announcement" element={<AnnouncementEditor/>} />

                        <Route path="news" element={<ArticleList/>} />
                        <Route path="news/edit" element={<ArticleEditor/>} />
                    </Route>

                    <Route path="/internal" element={
                        <Navigate to={"/internal/login"} />
                    }/>
                </Routes>

                <ToastContainer/>
            </Suspense>
        </BrowserRouter>
    </QueryClientProvider>;
}

root.render(<App/>);