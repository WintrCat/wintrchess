import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { ToastContainer } from "react-toastify";

import useSettingsStore from "@/stores/SettingsStore";
import useAnnouncement from "@/hooks/api/useAnnouncement";
import Announcement from "@/components/layout/Announcement";
import NavigationBar from "@/components/layout/NavigationBar";
import Footer from "@/components/layout/Footer";
import BugReportingWidget from "@/components/BugReportingWidget";

import PageWrapperProps from "./PageWrapperProps";
import * as styles from "./PageWrapper.module.css";

const queryClient = new QueryClient();

function PageWrapper({
    children,
    className,
    style,
    contentClassName,
    contentStyle,
    footerClassName,
    footerStyle
}: PageWrapperProps) {
    const bugReportingMode = useSettingsStore(
        state => state.settings.bugReportingMode
    );

    const { announcement, status: announcementStatus } = useAnnouncement();

    const [ announcementOpen, setAnnouncementOpen ] = useState(true);

    return <QueryClientProvider client={queryClient}>
        <div className={className} style={style}>
            {announcementOpen && announcementStatus == "success"
                && <Announcement
                    style={{ zIndex: 99 }}
                    setOpen={setAnnouncementOpen}
                    colour={announcement.colour}
                >
                    <ReactMarkdown className={styles.announcementMarkdown}>
                        {announcement.content}
                    </ReactMarkdown>
                </Announcement>
            }

            <NavigationBar/>

            <div
                className={`${styles.content} ${contentClassName}`}
                style={contentStyle}
            >
                {children}
            </div>

            <Footer className={footerClassName} style={footerStyle} />

            {bugReportingMode && <BugReportingWidget/>}

            <ToastContainer/>
        </div>
    </QueryClientProvider>;
}

export default PageWrapper;