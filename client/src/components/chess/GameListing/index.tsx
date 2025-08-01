import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";
import { truncate, uniqueId } from "lodash-es";

import { GameResult, getOpinionatedGameResult } from "shared/constants/game/GameResult";
import TimeControl from "shared/constants/game/TimeControl";
import { formatDate } from "shared/lib/utils/date";
import GameListingMetadata from "./GameListingMetadata";
import Button from "@/components/common/Button";
import displayToast from "@/lib/toast";

import GameListingProps from "./GameListingProps";
import * as styles from "./GameListing.module.css";

import iconTimeControlsBullet from "@assets/img/timeControls/bullet.png";
import iconTimeControlsBlitz from "@assets/img/timeControls/blitz.png";
import iconTimeControlsRapid from "@assets/img/timeControls/rapid.png";
import iconTimeControlsClassical from "@assets/img/timeControls/classical.svg";
import iconTimeControlsCorrespondence from "@assets/img/timeControls/correspondence.png";
import iconGameResultsDraw from "@assets/img/gameResults/draw.png";
import iconGameResultsUnopinionatedWin from "@assets/img/gameResults/unopinionated_win.png";
import iconGameResultsUnopinionatedLose from "@assets/img/gameResults/unopinionated_lose.png";
import iconGameResultsOpinionatedWin from "@assets/img/gameResults/opinionated_win.png";
import iconGameResultsOpinionatedLose from "@assets/img/gameResults/opinionated_lose.png";
import iconGameResultsUnknown from "@assets/img/gameResults/unknown.png";
import iconInterfaceCopy from "@assets/img/interface/copy.svg";

const timeControlIcons = {
    [TimeControl.BULLET]: iconTimeControlsBullet,
    [TimeControl.BLITZ]: iconTimeControlsBlitz,
    [TimeControl.RAPID]: iconTimeControlsRapid,
    [TimeControl.CLASSICAL]: iconTimeControlsClassical,
    [TimeControl.CORRESPONDENCE]: iconTimeControlsCorrespondence
};

// Gets a game result icon from white's result
const gameResultIcons = {
    unopinionated: {
        [GameResult.WIN]: iconGameResultsUnopinionatedWin,
        [GameResult.DRAW]: iconGameResultsDraw,
        [GameResult.LOSE]: iconGameResultsUnopinionatedLose,
        [GameResult.UNKNOWN]: iconGameResultsUnknown
    },
    opinionated: {
        [GameResult.WIN]: iconGameResultsOpinionatedWin,
        [GameResult.DRAW]: iconGameResultsDraw,
        [GameResult.LOSE]: iconGameResultsOpinionatedLose,
        [GameResult.UNKNOWN]: iconGameResultsUnknown
    }
};

// Map of game results to their tooltip keys in translation file
const gameResultTooltipCodes = {
    [GameResult.WIN]: "win",
    [GameResult.DRAW]: "draw",
    [GameResult.LOSE]: "lose",
    [GameResult.UNKNOWN]: "unknown"
};

const maxProfileLength = 20;

function GameListing<T extends GameListingMetadata>({
    className,
    style,
    game,
    perspective,
    selected,
    onClick,
    onSelect
}: GameListingProps<T>) {
    const { t } = useTranslation("common");

    const displayResult = useMemo(() => {
        if (!game.players.white.result) return;

        return perspective
            ? getOpinionatedGameResult(
                game.players.white.result,
                perspective
            )
            : game.players.white.result;
    }, [game, perspective]);

    const listingId = useMemo(uniqueId, []);

    function copyPGN() {
        if (!game.pgn) return;

        navigator.clipboard.writeText(game.pgn);

        displayToast({
            message: t("shareGame.copyPGNToast"),
            theme: "success"
        });
    }

    return <div
        className={[
            styles.gameListing,
            onClick && styles.clickableListing,
            className
        ].join(" ")}
        style={style}
        onClick={() => onClick?.(game)}
    >
        {onSelect && <input
            className={styles.selector}
            type="checkbox"
            checked={selected}
            onChange={event => onSelect(event.target.checked, game)}
            onClick={event => event.stopPropagation()}
        />}
        
        {game.timeControl && <div style={{ width: "30px" }}>
            <img
                className={styles.timeControlIcon}
                src={timeControlIcons[game.timeControl]}
                title={game.timeControl}
            />
        </div>}

        <div style={{ width: "250px" }}>
            {Object.entries(game.players)
                .map(([ colour, player ]) => <div
                    className={styles.playerProfile}
                    key={colour}
                >
                    {player.title && <span className={styles.playerTitle}>
                        {player.title}
                    </span>}
                    
                    <div className={styles.usersColour} style={{
                        backgroundColor: player === game.players.white
                            ? "whitesmoke" : "black"
                    }}/>

                    <span>
                        {truncate(player.username, {
                            length: maxProfileLength
                                - (player.title?.length || 0)
                        })}
                    </span>
    
                    <span style={{ color: "grey" }}>
                        ({player.rating || "?"})
                    </span>
                </div>)
            }
        </div>

        <div style={{ width: "110px" }}>
            <span title={game.date?.toLocaleString()}>
                {game.date ? formatDate(new Date(game.date)) : t(
                    "gameListing.gameResults.opinionated.unknown"
                )}
            </span>
        </div>

        {displayResult && <div style={{ width: "20px" }}>
            <img
                src={perspective
                    ? gameResultIcons.opinionated[displayResult]
                    : gameResultIcons.unopinionated[displayResult]
                }
                title={t(
                    "gameListing.gameResults."
                    + (perspective ? "opinionated." : "unopinionated.")
                    + gameResultTooltipCodes[displayResult]
                )}
                style={{ width: "100%" }}
            />
        </div>}

        {game.pgn && <Button
            className={styles.copyButton}
            icon={iconInterfaceCopy}
            tooltipId={`game-listing-copy-${listingId}`}
            onClick={event => {
                event.stopPropagation();
                copyPGN();
            }}
        />}

        <Tooltip
            id={`game-listing-copy-${listingId}`}
            content={t("gameListing.copyPGN")}
            delayShow={500}
        />
    </div>;
}

export default GameListing;