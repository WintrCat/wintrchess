import React, { useEffect, useMemo, useRef } from "react";
import { Move } from "chess.js";

import { getNodeParentChain } from "shared/types/game/position/StateTreeNode";
import Board from "@/apps/features/analysis/components/Board";
import RealtimeEngine from "@/apps/features/analysis/components/RealtimeEngine";
import Button from "@/components/common/Button";
import useSettingsStore from "@/stores/SettingsStore";
import playBoardSound from "@/lib/boardSounds";
import useLearnStore, { getLearnLineLength } from "../../stores/LearnStore";
import { learnOpenings } from "../../data/openings";

import * as styles from "./Learn.module.css";

import iconInterfaceFlip from "@assets/img/interface/flip.svg";
import iconInterfaceStart from "@assets/img/interface/start.svg";
import iconInterfaceBack from "@assets/img/interface/back.svg";
import iconInterfacePause from "@assets/img/interface/pause.svg";
import iconInterfacePlay from "@assets/img/interface/play.svg";
import iconInterfaceNext from "@assets/img/interface/next.svg";
import iconInterfaceEnd from "@assets/img/interface/end.svg";
import iconInterfaceClose from "@assets/img/interface/close.svg";

function Learn() {
    const { settings } = useSettingsStore();

    const {
        searchTerm,
        selectedOpeningId,
        rootNode,
        currentNode,
        displayedEngineLines,
        autoplayEnabled,
        boardFlipped,
        setSearchTerm,
        setCurrentNode,
        setDisplayedEngineLines,
        setAutoplayEnabled,
        setBoardFlipped,
        loadOpening,
        resetOpening,
        addFreeMove
    } = useLearnStore();

    const autoplayIntervalRef = useRef<ReturnType<typeof setInterval>>();

    const openingProgress = useMemo(() => {
        const path = getNodeParentChain(currentNode).reverse();

        return {
            currentPly: Math.max(0, path.length - 1),
            totalPly: getLearnLineLength(rootNode)
        };
    }, [currentNode, rootNode]);

    const displayedOpenings = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return learnOpenings;

        return learnOpenings.filter(opening => (
            opening.name.toLowerCase().includes(query)
        ));
    }, [searchTerm]);

    const currentOpening = useMemo(() => learnOpenings.find(
        opening => opening.id == selectedOpeningId
    ), [selectedOpeningId]);

    const playedUciMoves = useMemo(() => (
        getNodeParentChain(currentNode)
            .reverse()
            .filter(node => node.state.move)
            .map(node => node.state.move!.uci)
    ), [currentNode]);

    function traverseToBeginning() {
        resetOpening();
    }

    function traverseBackwards() {
        if (!currentNode.parent) return;

        setCurrentNode(currentNode.parent);
        setAutoplayEnabled(false);
    }

    function traverseForwards() {
        setCurrentNode(current => {
            const next = current.children.at(0);

            if (!next) {
                setAutoplayEnabled(false);
                return current;
            }

            playBoardSound(next);
            return next;
        });
    }

    function traverseToEnd() {
        setCurrentNode(current => {
            let terminal = current;

            while (terminal.children.length > 0) {
                terminal = terminal.children[0];
            }

            playBoardSound(terminal);
            return terminal;
        });

        setAutoplayEnabled(false);
    }

    useEffect(() => {
        if (!autoplayEnabled) {
            clearInterval(autoplayIntervalRef.current);
            return;
        }

        traverseForwards();

        autoplayIntervalRef.current = setInterval(() => {
            traverseForwards();
        }, 900);

        return () => clearInterval(autoplayIntervalRef.current);
    }, [autoplayEnabled]);

    function addMove(move: Move) {
        addFreeMove(move.san);
        return true;
    }

    return <div className={styles.wrapper}>
        <div className={styles.openingColumn}>
            <div className={styles.openingHeader}>
                <h2 className={styles.title}>Learn Openings</h2>
                <span className={styles.count}>100 lines</span>
            </div>

            <input
                className={styles.search}
                placeholder="Search openings or gambits..."
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
            />

            <div className={styles.openingList}>
                {displayedOpenings.map(opening => <button
                    key={opening.id}
                    className={styles.openingButton}
                    data-selected={opening.id == selectedOpeningId}
                    onClick={() => loadOpening(opening)}
                >
                    {opening.name}
                </button>)}
            </div>
        </div>

        <div className={styles.boardColumn}>
            <div className={styles.boardHeader}>
                <div>
                    <h3 className={styles.activeOpening}>
                        {currentOpening?.name || "Select an opening to begin"}
                    </h3>

                    <span className={styles.progress}>
                        Ply {openingProgress.currentPly} / {openingProgress.totalPly}
                    </span>
                </div>

                <Button
                    className={styles.flipButton}
                    icon={iconInterfaceFlip}
                    iconSize="32px"
                    onClick={() => setBoardFlipped(!boardFlipped)}
                />
            </div>

            <Board
                className={styles.board}
                node={currentNode}
                flipped={boardFlipped}
                piecesDraggable={!autoplayEnabled}
                onAddMove={addMove}
                theme={{
                    lightSquareColour: settings.themes.board.lightSquareColour,
                    darkSquareColour: settings.themes.board.darkSquareColour
                }}
            />

            <div className={styles.controls}>
                <img src={iconInterfaceStart} onClick={traverseToBeginning} />
                <img src={iconInterfaceBack} onClick={traverseBackwards} />

                <img
                    src={autoplayEnabled ? iconInterfacePause : iconInterfacePlay}
                    onClick={() => setAutoplayEnabled(!autoplayEnabled)}
                />

                <img src={iconInterfaceNext} onClick={traverseForwards} />
                <img src={iconInterfaceEnd} onClick={traverseToEnd} />

                <img src={iconInterfaceClose} onClick={resetOpening} />
            </div>

            <div className={styles.enginePanel}>
                {settings.analysis.engine.enabled && <RealtimeEngine
                    initialPosition={rootNode.state.fen}
                    playedUciMoves={playedUciMoves}
                    config={{
                        ...settings.analysis.engine,
                        timeLimit: settings.analysis.engine.timeLimitEnabled
                            ? settings.analysis.engine.timeLimit
                            : undefined
                    }}
                    cachedEngineLines={currentNode.state.engineLines}
                    onEngineLines={setDisplayedEngineLines}
                    onEvaluationComplete={lines => {
                        currentNode.state.engineLines = lines;
                    }}
                />}

                {!settings.analysis.engine.enabled && <i>
                    Engine analysis is disabled in settings.
                </i>}

                {displayedEngineLines.length == 0 && <i>
                    Engine lines will appear here.
                </i>}
            </div>
        </div>
    </div>;
}

export default Learn;
