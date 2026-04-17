import { create } from "zustand";

import { GameSourceType } from "@/components/chess/GameSelector/GameSource";

const STORAGE_KEY = "wintrchess:recent_accounts";
const MAX_ENTRIES = 5;

export type RecentAccountPlatform = "chess.com" | "lichess";

export interface RecentAccount {
    platform: RecentAccountPlatform;
    username: string;
    lastUsedAt: number;
}

export function gameSourceToPlatform(
    source: GameSourceType
): RecentAccountPlatform | null {
    if (source == "CHESS_COM") return "chess.com";
    if (source == "LICHESS") return "lichess";
    return null;
}

function readFromStorage(): RecentAccount[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw == null) throw new Error();

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) throw new Error();

        return parsed;
    } catch {
        localStorage.setItem(STORAGE_KEY, "[]");
        return [];
    }
}

function writeToStorage(accounts: RecentAccount[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

function matchesDedupeKey(
    entry: RecentAccount,
    platform: RecentAccountPlatform,
    dedupeKey: string
) {
    return entry.platform == platform
        && entry.username.toLowerCase() == dedupeKey;
}

interface RecentAccountsStore {
    accounts: RecentAccount[];
    addOrBump: (
        platform: RecentAccountPlatform,
        username: string
    ) => void;
    remove: (
        platform: RecentAccountPlatform,
        username: string
    ) => void;
}

const useRecentAccountsStore = create<RecentAccountsStore>((set, get) => ({
    accounts: readFromStorage(),

    addOrBump(platform, username) {
        const dedupeKey = username.toLowerCase();
        const filtered = get().accounts.filter(
            entry => !matchesDedupeKey(entry, platform, dedupeKey)
        );

        const updated: RecentAccount[] = [
            { platform, username, lastUsedAt: Date.now() },
            ...filtered
        ].slice(0, MAX_ENTRIES);

        writeToStorage(updated);
        set({ accounts: updated });
    },

    remove(platform, username) {
        const dedupeKey = username.toLowerCase();
        const updated = get().accounts.filter(
            entry => !matchesDedupeKey(entry, platform, dedupeKey)
        );

        writeToStorage(updated);
        set({ accounts: updated });
    }
}));

function useRecentAccounts() {
    return useRecentAccountsStore();
}

export default useRecentAccounts;
