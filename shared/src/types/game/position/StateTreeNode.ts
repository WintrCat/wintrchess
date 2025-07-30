import z from "zod";
import { Chess } from "chess.js";
import { round, clone, uniqueId, cloneDeep } from "lodash-es";

import { boardStateSchema } from "./BoardState";
import PieceColour from "@/constants/PieceColour";
import { pickEngineLines } from "./EngineLine";

export const stateTreeNodeSchema = z.object({
    id: z.string(),
    mainline: z.boolean(),
    state: boardStateSchema,
    get children(): z.ZodArray<typeof stateTreeNodeSchema> {
        return stateTreeNodeSchema.array();
    },
    get parent(): z.ZodOptional<typeof stateTreeNodeSchema> {
        return stateTreeNodeSchema.optional();
    }
});

export type StateTreeNode = z.infer<typeof stateTreeNodeSchema>;

export type SerializedStateTreeNode = (
    Omit<StateTreeNode, "children" | "parent">
    & { children: SerializedStateTreeNode[] }
);

/**
 * @description Remove parent from node, and recurse through all
 * children to remove their parents, to remove cyclic references.
 * Strips unnecessary engine lines from moves for compression.
 */
export function serializeNode(rootNode: StateTreeNode) {
    function serializePart(
        part: StateTreeNode
    ): SerializedStateTreeNode {
        part.parent = undefined;

        // Deep copy board state and strip engine lines
        const stateCopy = cloneDeep(part.state);

        stateCopy.engineLines = (
            pickEngineLines(
                stateCopy.fen,
                stateCopy.engineLines
            ) || []
        ).slice(0, 2);

        part.state = stateCopy;

        // Recursively serialize children
        part.children = part.children.map(
            child => serializePart(clone(child))
        );

        return part;
    }

    return serializePart(clone(rootNode));
}

/**
 * @description Recurses through children of a node N, setting their parents
 * back to N. Restores data stripped in compression from the client-held
 * version of the serialized root node.
 */
export function deserializeNode(
    serializedRoot: SerializedStateTreeNode,
    restoreRoot?: StateTreeNode
) {
    function deserializePart(
        node: SerializedStateTreeNode,
        parent?: SerializedStateTreeNode
    ) {
        const deserializedNode: StateTreeNode = {
            ...node,
            parent: parent,
            children: []
        };

        // Restore engine lines from the client-held tree
        if (restoreRoot) {
            deserializedNode.state.engineLines = findNodeRecursively(
                restoreRoot,
                restoreNode => restoreNode.id == node.id
            )?.state.engineLines || [];
        }

        // Recursively deserialize children
        deserializedNode.children = node.children.map(
            child => deserializePart(child, deserializedNode)
        );

        return deserializedNode;
    }

    return deserializePart(serializedRoot);
}

/**
 * @description Search recursively for a node that passes a given
 * predicate, starting from and including a root node. Returns the
 * first passing node or undefined if one cannot be found
 */
export function findNodeRecursively(
    rootNode: StateTreeNode,
    predicate: (node: StateTreeNode) => boolean,
    backwards = false
) {
    const frontier: StateTreeNode[] = [rootNode];

    while (frontier.length > 0) {
        const node = frontier.pop();
        if (!node) break;

        if (predicate(node)) {
            return node;
        }

        if (backwards) {
            if (node.parent) frontier.push(node.parent);
            continue;
        }

        frontier.push(...node.children);
    }
}

/**
 * @description Returns a list of the given node and its entire line
 * of priority children, or all children unordered if `expand` is true.
 */
export function getNodeChain(
    rootNode: StateTreeNode,
    expand?: boolean
) {
    const chain: StateTreeNode[] = [];

    const frontier: StateTreeNode[] = [rootNode];

    while (frontier.length > 0) {
        const current = frontier.pop();
        if (!current) break;

        chain.push(current);

        for (const child of current.children) {
            frontier.push(child);
            
            if (!expand) break;
        }
    }

    return chain;
}

/**
 * @description Returns a list of the given node plus all a chain
 * of its parents until the root node (inclusive)
 */
export function getNodeParentChain(node: StateTreeNode) {
    const chain: StateTreeNode[] = [];

    let current: StateTreeNode | undefined = node;

    while (current) {
        chain.push(current);
        current = current.parent;
    }

    return chain;
}

/**
 * @description Returns the move number of the given node. Can be decimal
 * for black moves, as these end in 0.5
 */
export function getNodeMoveNumber(
    node: StateTreeNode,
    initialPosition?: string
) {
    let initialMoveNumber = 1;

    if (initialPosition) {
        const board = new Chess(initialPosition);
    
        initialMoveNumber = board.moveNumber()
            + (board.turn() == "b" ? 0.5 : 0);
    }

    let current: StateTreeNode = node;
    let depth = 0;

    while (current?.parent) {
        current = current.parent;
        depth++;
    }

    // current = Root Node at this point
    let pairDepth = (depth - 1) / 2;

    return round(pairDepth, 1) + initialMoveNumber;
}

/**
 * @description Returns a list of the given node's siblings.
 */
export function getNodeSiblings(node: StateTreeNode) {
    return node.parent?.children.filter(
        child => child != node
    ) || [];
}

/**
 * @description Adds a child to the node based on the SAN move given;
 * returns the added node.
 */
export function addChildMove(node: StateTreeNode, san: string) {
    const existingNode = node.children.find(
        child => child.state.move?.san == san
    );
    
    const childMove = new Chess(node.state.fen).move(san);

    const createdNode: StateTreeNode = {
        id: uniqueId(),
        mainline: node.mainline
            && !node.children.some(
                child => child.mainline
            ),
        parent: node,
        children: [],
        state: {
            fen: childMove.after,
            engineLines: [],
            move: {
                san: childMove.san,
                uci: childMove.lan
            },
            moveColour: childMove.color == "w"
                ? PieceColour.WHITE
                : PieceColour.BLACK
        }
    };

    if (!existingNode) {
        node.children.push(createdNode);
    }

    return existingNode || createdNode;
}