import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StatusCodes } from "http-status-codes";

import { Game, getColourPlayed } from "shared/types/game/Game";
import APIResponse from "@/types/APIResponse";
import { GameSourceType } from "@/components/chess/GameSelector/GameSource";
import getChessComGames from "@/lib/games/chessCom";
import getLichessGames from "@/lib/games/lichess";
import Dialog from "@/components/common/Dialog";
import Loader from "@/components/common/Loader";
import LogMessage from "@/components/common/LogMessage";
import MonthSelector from "@/components/settings/MonthSelector";
import GameListing from "@/components/chess/GameListing";
import displayToast from "@/lib/toast";

import GameSearchMenuProps from "./GameSearchMenuProps";
import * as styles from "./GameSearchMenu.module.css";

import iconInterfaceRightChevron from "@assets/img/interface/right_chevron.svg";

class UserNotFoundError extends Error {}

async function fetchGames(
    gameSourceKey: GameSourceType,
    username: string,
    month: number,
    year: number
): APIResponse<{ games: Game[] }> {
    switch (gameSourceKey) {
        case "CHESS_COM":
            return await getChessComGames(username, month, year);
        case "LICHESS":
            return await getLichessGames(username, month, year);
        default:
            return { status: StatusCodes.OK };
    }
}

function GameSearchMenu({
    username,
    gameSource,
    onClose,
    onGameSelect
}: GameSearchMenuProps) {
    const { t } = useTranslation("analysis");

    const queryClient = useQueryClient();

    const [ month, setMonth ] = useState(new Date().getMonth() + 1);
    const [ year, setYear ] = useState(new Date().getFullYear());

    const longFetchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [ isLongFetch, setIsLongFetch ] = useState(false);

    const { data: games, status, fetchStatus, error } = useQuery({
        queryKey: ["games", gameSource.key, username, month, year], 
        queryFn: async () => {
            if (longFetchTimerRef.current != null) {
                clearTimeout(longFetchTimerRef.current);
                setIsLongFetch(false);
            }

            longFetchTimerRef.current = setTimeout(
                () => setIsLongFetch(true), 2500
            );

            const response = await fetchGames(
                gameSource.key, username, month, year
            );

            switch (response.status) {
                case StatusCodes.NOT_FOUND:
                    throw new UserNotFoundError(
                        t("gameSearchMenu.userNotFound")
                    );
                case StatusCodes.OK:
                    return response.games || [];
                default:
                    throw new Error(
                        t("gameSearchMenu.unknownError")
                    );
            }
        },
        retry: (failureCount, error) => {
            return !(error instanceof UserNotFoundError);
        },
        retryDelay: 2000,
        staleTime: Infinity
    });

    function selectListing(game: Game) {
        displayToast({
            message: t("gameSearchMenu.selectedToast"),
            theme: "success"
        });

        onGameSelect?.(game);
        onClose();
    }

    return <Dialog
        className={styles.dialog}
        onClose={onClose}
    >
        <span className={styles.title}>
            {t("gameSearchMenu.title")}
        </span>

        <span className={styles.sourceTitle}>
            {gameSource.title}

            <img src={iconInterfaceRightChevron} />

            {username}
        </span>

        <MonthSelector 
            onMonthChange={(month, year) => {
                // Cancel other queries for games
                queryClient.cancelQueries({ queryKey: ["games"] });

                setMonth(month);
                setYear(year);
            }} 
            locked={status == "error"}
        />

        <div className={styles.list}>
            {status == "error" && fetchStatus == "idle"
                && <LogMessage>{error.message}</LogMessage>
            }

            {fetchStatus == "fetching"
                && <div className={styles.loadingMessage}>
                    <Loader/>
                    
                    <span>
                        {t("gameSearchMenu.loading")}
                    </span>

                    {isLongFetch && <span>
                        {t("gameSearchMenu.loadingLong")}
                    </span>}
                </div>
            }

            {status == "success" && fetchStatus == "idle"
                && (games.length > 0 ?
                    games.slice().map(game => <GameListing
                        key={game.pgn}
                        game={game}
                        perspective={getColourPlayed(game, username)}
                        onClick={selectListing}
                    />)
                    : t("gameSearchMenu.noGamesFound")
                )
            }
        </div>
    </Dialog>;
}

export default GameSearchMenu;