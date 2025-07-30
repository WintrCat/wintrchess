import { Chess } from "chess.js";

import { EngineLine } from "shared/types/game/position/EngineLine";
import EngineVersion from "shared/constants/EngineVersion";
import { STARTING_FEN } from "shared/constants/utils";

// Convert UCI evaluation types to our ones
const uciEvaluationTypes: Record<string, string | undefined> = {
    cp: "centipawn",
    mate: "mate"
};

class Engine {
    private worker: Worker;
    private version: EngineVersion;

    private position = STARTING_FEN;
    private evaluating = false;

    constructor(version: EngineVersion) {
        this.worker = new Worker("engines/" + version);
        this.version = version;

        this.worker.postMessage("uci");
        this.setPosition(this.position);
    }

    private consumeLogs(
        command: string,
        endCondition: (logMessage: string) => boolean,
        onLogReceived?: (logMessage: string) => void
    ): Promise<string[]> {
        this.worker.postMessage(command);

        const worker = this.worker;
        const logMessages: string[] = [];

        return new Promise((res, rej) => {
            function onMessageReceived(event: MessageEvent) {
                const message = String(event.data);

                onLogReceived?.(message);
    
                logMessages.push(message);
    
                if (endCondition(message)) {
                    worker.removeEventListener("message", onMessageReceived);
                    worker.removeEventListener("error", rej);

                    res(logMessages);
                }
            }

            this.worker.addEventListener("message", onMessageReceived);
            this.worker.addEventListener("error", rej);
        });
    }

    onMessage(handler: (message: string) => void) {
        this.worker.addEventListener("message", event => {
            handler(String(event.data));
        });

        return this;
    }

    onError(handler: (error: string) => void) {
        this.worker.addEventListener("error", event => {
            handler(String(event.error));
        });

        return this;
    }

    terminate() {
        this.worker.postMessage("quit");
    }

    setOption(option: string, value: string) {
        this.worker.postMessage(
            `setoption name ${option} value ${value}`
        );

        return this;
    }

    setLineCount(lines: number) {
        this.setOption("MultiPV", lines.toString());

        return this;
    }

    setThreadCount(threads: number) {
        this.setOption("Threads", threads.toString());

        return this;
    }

    setPosition(fen: string, uciMoves?: string[]) {
        if (uciMoves?.length) {
            this.worker.postMessage(
                `position fen ${fen} moves ${uciMoves.join(" ")}`
            );

            const board = new Chess(fen);
            for (const uciMove of uciMoves) {
                board.move(uciMove);
            }

            this.position = board.fen();

            return this;
        }

        this.worker.postMessage(`position fen ${fen}`);
        this.position = fen;

        return this;
    }

    async evaluate(options: {
        depth: number;
        timeLimit?: number;
        onEngineLine?: (line: EngineLine) => void;
    }): Promise<EngineLine[]> {
        const engineLines: EngineLine[] = [];

        const maxTimeArgument = options.timeLimit
            ? `movetime ${options.timeLimit}` : "";

        this.evaluating = true;

        await this.consumeLogs(
            `go depth ${options.depth} ${maxTimeArgument}`,
            log => (
                log.startsWith("bestmove")
                || log.includes("depth 0")
            ),
            log => {
                if (!log.startsWith("info depth")) return;
                if (log.includes("currmove")) return;

                // Extract depth and multipv index of line
                const depth = parseInt(log.match(/(?<= depth )\d+/)?.[0] || "");
                if (isNaN(depth)) return;

                const index = parseInt(log.match(/(?<= multipv )\d+/)?.[0] || "") || 1;

                // Extract evaluation type and score
                const scoreMatches = log.match(/ score (cp|mate) (-?\d+)/);

                const evaluationType = uciEvaluationTypes[scoreMatches?.[1] || ""];
                if (
                    evaluationType != "centipawn"
                    && evaluationType != "mate"
                ) return;

                let evaluationScore = parseInt(scoreMatches?.[2] || "");
                if (isNaN(evaluationScore)) return;

                // Make sure evaluations are always from White's view
                if (this.position.includes(" b ")) {
                    evaluationScore = -evaluationScore;
                }

                // Extract UCI moves from pv
                const moveUcis = log.match(/ pv (.*)/)?.at(1)?.split(" ") || [];

                // Convert these to SANs on a temp board
                const moveSans: string[] = [];

                const board = new Chess(this.position);
                for (const moveUci of moveUcis) {
                    moveSans.push(board.move(moveUci).san);
                }

                // Remove old duplicate line and add new one
                const newEngineLine: EngineLine = {
                    depth: depth,
                    index: index,
                    evaluation: {
                        type: evaluationType,
                        value: evaluationScore
                    },
                    source: this.version,
                    moves: moveUcis.map((moveUci, moveIndex) => ({
                        uci: moveUci,
                        san: moveSans[moveIndex]
                    }))
                };

                engineLines.push(newEngineLine);
                options.onEngineLine?.(newEngineLine);
            }
        );

        this.evaluating = false;

        return engineLines;
    }

    async stopEvaluation() {
        this.worker.postMessage("stop");

        if (this.evaluating) {
            await this.consumeLogs(
                "", log => log.includes("bestmove")
            );
        }

        this.evaluating = false;
    }
}

export default Engine;