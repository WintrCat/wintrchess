import { StatusCodes } from "http-status-codes";
import { clone } from "lodash-es";

import AnalysisOptions from "shared/lib/reporter/types/AnalysisOptions";
import {
    GameAnalysis,
    SerializedGameAnalysis
} from "shared/types/game/GameAnalysis";
import {
    StateTreeNode,
    serializeNode,
    deserializeNode
} from "shared/types/game/position/StateTreeNode";
import APIResponse from "@/types/APIResponse";

export async function analyseStateTree(
    rootNode: StateTreeNode,
    options?: AnalysisOptions
): APIResponse<{ gameAnalysis: GameAnalysis }> {
    const reportURL = "http://localhost:8080/api/analysis/analyse"
    + `?brilliant=${String(options?.includeBrilliant)}`
    + `&critical=${String(options?.includeCritical)}`
    + `&theory=${String(options?.includeTheory)}`;

    const reportResponse = await fetch(reportURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(
            serializeNode(rootNode)
        )
    });

    if (!reportResponse.ok)
        return { status: reportResponse.status };

    const serializedAnalysis: SerializedGameAnalysis = (
        await reportResponse.json()
    );

    return {
        status: reportResponse.status,
        gameAnalysis: {
            ...serializedAnalysis,
            stateTree: deserializeNode(
                serializedAnalysis.stateTree,
                rootNode
            )
        }
    };
}

export async function analyseNode(
    node: StateTreeNode,
    options?: AnalysisOptions
): APIResponse<{ node: StateTreeNode }> {
    if (!node.parent)
        return { status: StatusCodes.BAD_REQUEST };

    const childlessNode = clone(node);
    childlessNode.children = [];

    const parentNode = clone(node.parent);
    parentNode.children = [childlessNode];

    const reportResult = await analyseStateTree(parentNode, options);
    const analysedNode = reportResult.gameAnalysis?.stateTree.children.at(0);

    return {
        status: reportResult.status,
        node: analysedNode
    };
}
