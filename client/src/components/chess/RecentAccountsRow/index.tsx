import React, { useRef, useState } from "react";

import useRecentAccounts, {
    RecentAccount,
    RecentAccountPlatform
} from "@/hooks/useRecentAccounts";

import RecentAccountsRowProps from "./RecentAccountsRowProps";
import * as styles from "./RecentAccountsRow.module.css";

import iconChessCom from "@assets/img/connections/chesscom.png";
import iconLichess from "@assets/img/connections/lichess.svg";

const platformIcons: Record<RecentAccountPlatform, string> = {
    "chess.com": iconChessCom,
    lichess: iconLichess
};

const LONG_PRESS_MS = 500;

interface ChipProps {
    account: RecentAccount;
    onSelect: (username: string) => void;
    onRemove: () => void;
}

function Chip({ account, onSelect, onRemove }: ChipProps) {
    const [ revealed, setRevealed ] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const longPressFiredRef = useRef(false);

    function clearTimer() {
        if (timerRef.current == null) return;
        clearTimeout(timerRef.current);
        timerRef.current = null;
    }

    function startLongPress() {
        longPressFiredRef.current = false;
        clearTimer();
        timerRef.current = setTimeout(() => {
            longPressFiredRef.current = true;
            setRevealed(true);
        }, LONG_PRESS_MS);
    }

    function cancelLongPress() {
        clearTimer();
    }

    return <button
        className={[
            styles.chip,
            revealed ? styles.chipRevealed : ""
        ].join(" ")}
        onClick={() => {
            if (longPressFiredRef.current) {
                longPressFiredRef.current = false;
                return;
            }

            onSelect(account.username);
        }}
        onTouchStart={startLongPress}
        onTouchEnd={cancelLongPress}
        onTouchMove={cancelLongPress}
        onTouchCancel={cancelLongPress}
    >
        <img
            className={styles.platformIcon}
            src={platformIcons[account.platform]}
            alt={account.platform}
        />

        <span className={styles.username}>
            {account.username}
        </span>

        <span
            className={styles.removeButton}
            role="button"
            aria-label="Remove"
            onClick={event => {
                event.stopPropagation();
                onRemove();
            }}
        >
            ×
        </span>
    </button>;
}

function RecentAccountsRow({ onUsernameSelect }: RecentAccountsRowProps) {
    const { accounts, remove } = useRecentAccounts();

    if (accounts.length == 0) return null;

    return <div className={styles.wrapper}>
        <span className={styles.label}>Recent:</span>

        {accounts.map(account => <Chip
            key={`${account.platform}:${account.username.toLowerCase()}`}
            account={account}
            onSelect={onUsernameSelect}
            onRemove={() => remove(account.platform, account.username)}
        />)}
    </div>;
}

export default RecentAccountsRow;
