import z from "zod";
import { Chess } from "chess.js";
import { uniq, maxBy } from "lodash-es";

import EngineVersion from "@/constants/EngineVersion";
import { evaluationSchema } from "./Evaluation";
import { moveSchema } from "./Move";

export const engineLineSchema = z.object({
    evaluation: evaluationSchema,
    source: z.enum(EngineVersion),
    depth: z.number(),
    index: z.number(),
    moves: z.array(moveSchema)
});

export type EngineLine = z.infer<typeof engineLineSchema>;

export function isEngineLineEqual(line: EngineLine, other: EngineLine) {
    return (
        line.depth == other.depth
        && line.index == other.index
        && line.source == other.source
    );
}

/**
 * @description Finds an engine line in a list of lines that is the same
 * as the reference line but has a specified index.
 */
export function getLineGroupSibling(
    lines: EngineLine[],
    referenceLine: EngineLine,
    index: number
) {
    return lines.find(line => (
        line.depth == referenceLine.depth
        && line.source == referenceLine.source
        && line.index == index
    ));
}

/**
 * @description Returns the line with the highest depth and lowest index.
 */
export function getTopEngineLine(lines: EngineLine[]) {
    return maxBy(lines, line => line.depth - line.index);
}

/**
 * @description Returns the best set of engine lines that meet all given
 * criteria, or null if any of the criteria cannot be met. Regardless of
 * target source, Lichess cloud lines will be returned if found. Returned
 * lines are NOT copied!
 */
export function pickEngineLines(
    fen: string,
    lines: EngineLine[],
    targets?: {
        count?: number;
        depth?: number;
        source?: EngineVersion;
    }
) {
    let {
        count: targetCount,
        depth: targetDepth = 0,
        source: targetSource
    } = targets || {};

    if (targetCount) {
        targetCount = Math.min(
            Math.max(new Chess(fen).moves().length, 1),
            targetCount
        );
    }

    const depths = uniq(lines
        .filter(line => line.depth >= targetDepth || line.depth == 0)
        .map(line => line.depth)
        .sort((a, b) => b - a)
    );

    function findLineSet(depth: number, source: EngineVersion) {
        const lineSet: EngineLine[] = [];

        while (!targetCount || lineSet.length < targetCount) {
            const nextLine = lines.find(line => (
                line.depth == depth
                && line.source == source
                && line.index == lineSet.length + 1
            ));
            if (!nextLine) break;

            lineSet.push(nextLine);
        }

        return lineSet;
    }

    for (const depth of depths) {
        const lineSets = Object.values(EngineVersion)
            .filter(source => (
                source == EngineVersion.LICHESS_CLOUD
                || (!targetSource || source == targetSource)
            ))
            .map(source => findLineSet(depth, source));

        const qualifyingLineSet = maxBy(
            lineSets, lineSet => lineSet.length
        );

        if (
            qualifyingLineSet
            && (!targetCount || qualifyingLineSet.length >= targetCount)
        ) return qualifyingLineSet.sort((a, b) => a.index - b.index);
    }

    return null;
}