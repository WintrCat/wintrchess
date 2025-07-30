import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { StatusCodes } from "http-status-codes";

import LoadingPlaceholder from "@/components/layout/LoadingPlaceholder";
import Separator from "@/components/common/Separator";
import LogMessage from "@/components/common/LogMessage";
import Button from "@/components/common/Button";
import ButtonColour from "@/components/common/Button/Colour";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import GameListing from "@/components/chess/GameListing";
import { deleteArchivedGames, getArchivedGames } from "@/lib/gameArchive";

import * as styles from "./Archive.module.css";

import iconArchive from "@assets/img/icons/archive.png";
import iconDelete from "@assets/img/interface/delete.svg";

function Archive() {
    const { t } = useTranslation(["otherPages", "common"]);

    const { data: archive, status, refetch } = useQuery({
        queryKey: ["archive"],
        queryFn: async () => {
            const response = await getArchivedGames();
            if (response.status != StatusCodes.OK) throw new Error();

            return response.games;
        },
        refetchOnWindowFocus: false,
        retry: false
    });

    const [ selectedGameIds, setSelectedGameIds ] = useState<string[]>([]);

    const [ deleteDialogOpen, setDeleteDialogOpen ] = useState(false);

    return <div className={styles.wrapper}>
        <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
                <span className={styles.title}>
                    <img src={iconArchive} height={24} />

                    {t("archive.title") + " "}
                    
                    ({archive ? Object.keys(archive).length : "..."})
                </span>

                {archive && selectedGameIds.length > 0
                    && <span className={styles.selection}>
                        {t("archive.selected", {
                            amount: selectedGameIds.length
                        })}

                        <a onClick={() => setSelectedGameIds(
                            Object.keys(archive)
                        )}>
                            {t("archive.selectAll")}
                        </a>
                    </span>
                }
            </div>

            {selectedGameIds.length > 0 &&
                <div className={styles.toolbarRight}>
                    <Button onClick={() => setSelectedGameIds([])}>
                        {t("cancel", { ns: "common" })}
                    </Button>

                    <Button
                        style={{
                            backgroundColor: ButtonColour.RED,
                            padding: "8px"
                        }}
                        icon={iconDelete}
                        iconSize="28px"
                        onClick={() => setDeleteDialogOpen(true)}
                    />
                </div>
            }
        </div>

        <Separator/>

        {status == "error" && <LogMessage>
            {t("archive.error")}
        </LogMessage>}

        {status == "pending" && <LoadingPlaceholder/>}

        <div className={styles.games}>
            {archive && Object.entries(archive).map(
                ([ id, game ]) => <GameListing
                    style={{ justifyContent: "start" }}
                    game={game}
                    selected={selectedGameIds.includes(id)}
                    onClick={() => location.href = `/analysis?game=${id}`}
                    onSelect={selected => {
                        if (selected) return setSelectedGameIds([
                            ...selectedGameIds, id
                        ]);

                        setSelectedGameIds(selectedGameIds.filter(
                            selectedId => selectedId != id
                        ));
                    }}
                />
            )}
        </div>

        {deleteDialogOpen && <ConfirmDialog
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={async () => {
                await deleteArchivedGames(selectedGameIds);
                await refetch();

                setSelectedGameIds([]);
            }}
            dangerAction
        >
            <span style={{ color: "white" }}>
                {t("archive.deleteConfirm", {
                    amount: selectedGameIds.length
                })}
            </span>
        </ConfirmDialog>}
    </div>;
}

export default Archive;