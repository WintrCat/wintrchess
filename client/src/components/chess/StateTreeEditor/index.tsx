import React from "react";
import { useTranslation } from "react-i18next";

import generateTreeView from "./treeParser";
import MoveClickEventContext from "./MoveClickEventContext";
import StateTreeEditorProps from "./StateTreeEditorProps";
import * as styles from "./StateTreeEditor.module.css";

function StateTreeEditor({
    className,
    style,
    stateTreeRootNode,
    onMoveClick
}: StateTreeEditorProps) {
    const { t } = useTranslation("analysis");

    const treeView = generateTreeView(stateTreeRootNode);

    return <div className={className} style={style}>
        <MoveClickEventContext.Provider value={onMoveClick}>
            {treeView.length > 0
                ? treeView
                : <i className={styles.addNodePrompt}>
                    {t("stateTreeEditor.addNodePrompt")}
                </i>
            }
        </MoveClickEventContext.Provider>
    </div>;
}

export default StateTreeEditor;