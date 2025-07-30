import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

import { Announcement } from "shared/types/Announcement";
import useAnnouncement from "@/hooks/api/useAnnouncement";
import AnnouncementBanner from "@/components/layout/Announcement";
import ColourSwatch from "@/components/settings/ColourSwatch";
import Button from "@/components/common/Button";
import ButtonColour from "@/components/common/Button/Colour";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import TextField from "@/components/common/TextField";
import displayToast from "@/lib/toast";

import * as styles from "./AnnouncementEditor.module.css";

import iconInterfaceEdit from "@assets/img/interface/edit.svg";
import iconInterfaceDelete from "@assets/img/interface/delete.svg";

function AnnouncementEditor() {
    const { announcement: liveAnnouncement } = useAnnouncement();

    const [ bannerColour, setBannerColour ] = useState("#000");
    const [ bannerColourPickerOpen, setBannerColourPickerOpen ] = useState(false);

    const [ bannerContent, setBannerContent ] = useState("");

    const [ publishConfirmOpen, setPublishConfirmOpen ] = useState(false);
    const [ clearConfirmOpen, setClearConfirmOpen ] = useState(false);

    useEffect(() => {
        if (!liveAnnouncement) return;

        setBannerColour(liveAnnouncement.colour);
        setBannerContent(liveAnnouncement.content);
    }, [liveAnnouncement]);

    async function publishAnnouncement(announcement?: Announcement) {
        const response = await fetch("/internal/announcement/publish", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: announcement && JSON.stringify(announcement)
        });

        if (!response.ok) return displayToast({
            message: "Failed to publish announcement.",
            theme: "error"
        });

        if (announcement) {
            displayToast({
                message: "Announcement published!",
                theme: "success"
            });
        } else {
            displayToast({
                message: "Announcement cleared.",
                theme: "info"
            });
        }
    }

    return <div
        className={styles.wrapper}
        onClick={() => setBannerColourPickerOpen(false)}
    >
        <h1>Edit</h1>

        <div className={styles.editor}>
            <TextField
                placeholder="Announcement..."
                onChange={setBannerContent}
                value={bannerContent}
                wrapperClassName={styles.editorField}
                style={{
                    borderRadius: "10px",
                    border: "3px solid #242424"
                }}
            />

            <ColourSwatch
                colour={bannerColour}
                onColourChange={setBannerColour}
                open={bannerColourPickerOpen}
                onToggle={setBannerColourPickerOpen}
            />
        </div>

        <h1>Preview</h1>

        <div className={styles.announcementPreview}>
            <AnnouncementBanner
                colour={bannerColour}
                style={{ zIndex: 0 }}
            >
                <ReactMarkdown className={styles.announcementMarkdown}>
                    {bannerContent}
                </ReactMarkdown>
            </AnnouncementBanner>
        </div>

        <div className={styles.buttonBar}>
            <Button
                icon={iconInterfaceEdit}
                style={{
                    gap: "5px",
                    backgroundColor: ButtonColour.BLUE
                }}
                onClick={() => setPublishConfirmOpen(true)}
            >
                Publish
            </Button>

            <Button
                icon={iconInterfaceDelete}
                style={{
                    gap: "5px",
                    backgroundColor: ButtonColour.RED
                }}
                onClick={() => setClearConfirmOpen(true)}
            >
                Clear
            </Button>
        </div>

        {publishConfirmOpen && <ConfirmDialog
            onClose={() => setPublishConfirmOpen(false)}
            onConfirm={() => publishAnnouncement({
                colour: bannerColour,
                content: bannerContent
            })}
        >
            Are you sure you want to publish this announcement?
        </ConfirmDialog>}

        {clearConfirmOpen && <ConfirmDialog
            onClose={() => setClearConfirmOpen(false)}
            onConfirm={() => publishAnnouncement()}
            dangerAction
        >
            Are you sure you want to clear the announcement?
        </ConfirmDialog>}
    </div>;
}

export default AnnouncementEditor;