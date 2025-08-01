import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import { findNodeRecursively, getNodeChain } from "shared/types/game/position/StateTreeNode";
import { classificationImages } from "@analysis/constants/classifications";
import ContextMenu from "@/components/common/ContextMenu";
import useSettingsStore from "@/stores/SettingsStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import useContextMenu from "@/hooks/useContextMenu";

import MoveClickEventContext from "../../MoveClickEventContext";
import MoveProps from "./MoveProps";
import * as styles from "./Move.module.css";

import iconInterfaceDelete from "@assets/img/interface/delete.svg";
import iconInterfaceUp from "@assets/img/interface/up.svg";
import iconInterfaceHelp from "@assets/img/interface/help.svg";

function Move({ node, children }: MoveProps) {
    const { t } = useTranslation("analysis");

    const onMoveClick = useContext(MoveClickEventContext);

    const classificationsHidden = useSettingsStore(
        state => state.settings.analysis.classifications.hide
    );

    const {
        currentStateTreeNode,
        setCurrentStateTreeNode,
        dispatchCurrentNodeUpdate
    } = useAnalysisBoardStore();

    const {
        contextMenuPosition,
        openContextMenu
    } = useContextMenu();

    function deleteNode() {
        if (!node?.parent) return;

        // Remove this node
        const siblings = node.parent.children;

        siblings.splice(
            siblings.indexOf(node),
            1
        );

        // If deleted node was mainline, promote first sibling
        if (node.mainline && siblings.length > 0) {
            for (const siblingChainNode of getNodeChain(siblings[0])) {
                siblingChainNode.mainline = true;
            }
        }

        // If the current node is a child of or is the deleted node
        const deletedNodeCurrentChild = findNodeRecursively(
            node,
            searchNode => searchNode.id == currentStateTreeNode.id
        );

        // Then, set the current node to the parent of the deleted one
        if (deletedNodeCurrentChild) {
            setCurrentStateTreeNode(node.parent);
        }

        dispatchCurrentNodeUpdate();
    }

    function promoteNode() {
        if (!node?.parent) return;

        const siblings = node.parent.children;

        const promotedNode = siblings
            .splice(siblings.indexOf(node), 1)
            .at(0);

        if (!promotedNode) return;

        siblings.unshift(promotedNode);

        setCurrentStateTreeNode(node);
    }

    return <>
        {node?.state.classification
            && !classificationsHidden
            && <img
                src={classificationImages[node.state.classification]}
                width={20}
                height={20}
            />
        }

        <span
            className={
                styles.wrapper
                + ` ${currentStateTreeNode == node && styles.current}`
            }
            onClick={() => {
                if (node) onMoveClick?.(node);
            }}
            onContextMenu={openContextMenu}
        >
            {node?.state.move?.san || children || "?"}
        </span>

        {contextMenuPosition && <ContextMenu
            position={contextMenuPosition}
            options={[
                {
                    icon: iconInterfaceDelete,
                    label: t("stateTreeEditor.moveContextMenu.delete"),
                    onSelect: deleteNode
                },
                {
                    icon: iconInterfaceUp,
                    label: t("stateTreeEditor.moveContextMenu.promote"),
                    onSelect: promoteNode
                },
                ...(process.env.NODE_ENV == "development"
                    ? [{
                        icon: iconInterfaceHelp,
                        label: "Log state tree node",
                        onSelect: () => console.log(node)
                    }]
                    : []
                )
            ]}
        />}
    </>;
}

export default Move;