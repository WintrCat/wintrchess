import React from "react";
import { Outlet } from "react-router-dom";

import SidebarTab from "@/components/layout/sidebar/SidebarTab";

import * as styles from "./Dashboard.module.css";

import iconLogo from "@assets/img/logo.svg";
import iconNews from "@assets/img/interface/news.svg";
import iconAnnouncement from "@assets/img/interface/announcement.svg";

function Dashboard() {
    return <div className={styles.wrapper}>
        <h1 className={styles.title}>
            <img
                src={iconLogo}
                height={45}
            />

            Internal
        </h1>

        <div className={styles.tabs}>
            <SidebarTab
                className={styles.tab}
                url="/internal/dashboard/news"
                icon={iconNews}
            >
                News Articles
            </SidebarTab>

            <SidebarTab
                className={styles.tab}
                url="/internal/dashboard/announcement"
                icon={iconAnnouncement}
            >
                Announcement
            </SidebarTab>
        </div>

        <Outlet/>
    </div>;
}

export default Dashboard;