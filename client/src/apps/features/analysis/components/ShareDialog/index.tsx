import React from "react";
import { useTranslation } from "react-i18next";

import renderStateTree from "shared/lib/stateTree/render";
import Dialog from "@/components/common/Dialog";
import TextField from "@/components/common/TextField";

import ShareDialogProps from "./ShareDialogProps";
import * as styles from "./ShareDialog.module.css";

function ShareDialog({ game, currentNode, onClose }: ShareDialogProps) {
    const { t } = useTranslation(["common", "analysis"]);

    return <Dialog className={styles.wrapper} onClose={onClose}>
        <div className={styles.title}>
            {t("optionsToolbar.share", { ns: "analysis" })}
        </div>

        <div className={styles.content}>
            <div className={styles.section}>
                <span>FEN</span>

                <TextField
                    wrapperStyle={{ width: "100%" }}
                    className={styles.field}
                    copyClassName={styles.fieldCopy}
                    value={currentNode.state.fen}
                    readOnly
                    copyable
                    copyTooltip={t("shareGame.copyFEN")}
                    copyToast={t("shareGame.copyFENToast")}
                    onClick={event => event.currentTarget.select()}
                />
            </div>

            <div className={styles.section}>
                <span>PGN</span>

                <TextField
                    wrapperStyle={{ width: "100%", height: "300px" }}
                    className={styles.field}
                    copyClassName={styles.areaFieldCopy}
                    value={renderStateTree(game.stateTree, game)}
                    multiline
                    readOnly
                    copyable
                    copyTooltip={t("shareGame.copyPGN")}
                    copyToast={t("shareGame.copyPGNToast")}
                    onClick={event => event.currentTarget.select()}
                />
            </div>
        </div>
    </Dialog>;
}

export default ShareDialog;