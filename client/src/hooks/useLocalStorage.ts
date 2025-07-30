import { useMemo } from "react";
import { create } from "zustand";

import LocalStorageKey from "@/constants/LocalStorageKey";

interface ItemController<ValueType> {
    value?: string;
    parsedValue: Partial<ValueType>;
    set: (value: Partial<ValueType>) => void;
}

interface LocalStorageStore {
    storage: Record<string, string>;

    getLocalItem: (key: string) => string | undefined;
    setLocalItem: (key: string, value: string) => void;
}

const useLocalStorageStore = create<LocalStorageStore>((set, get) => ({
    storage: {},

    getLocalItem(key) {
        return get().storage[key];
    },

    setLocalItem(key, value) {
        localStorage.setItem(key, value);

        set(state => ({
            storage: {
                ...state.storage,
                [key]: value
            }
        }));
    }
}));

function serialise(value: any) {
    return typeof value == "object"
        ? JSON.stringify(value)
        : String(value);
}

function useLocalStorage<ValueType>(
    key: LocalStorageKey
): ItemController<ValueType>;

function useLocalStorage<ValueType>(
    key: LocalStorageKey,
    defaultValue: ValueType
): ItemController<ValueType> & { value: string };

function useLocalStorage<ValueType>(
    key: LocalStorageKey,
    defaultValue?: ValueType 
) {
    const {
        storage,
        getLocalItem,
        setLocalItem
    } = useLocalStorageStore();

    const value = useMemo(() => {
        const localItem = getLocalItem(key);
        const savedItem = localStorage.getItem(key) || (
            defaultValue != undefined
                ? serialise(defaultValue)
                : undefined
        );

        if (!localItem && savedItem) {
            setLocalItem(key, savedItem);
        }

        return localItem || savedItem;
    }, [storage]);

    function set(value: Partial<ValueType>) {
        setLocalItem(key, serialise(value));
    }

    function parse(): Partial<ValueType> {
        if (value == null) return {};

        try {
            return JSON.parse(value);
        } catch {
            return {};
        }
    }

    return {
        value: value,
        parsedValue: parse(),
        set: set
    };
}

export default useLocalStorage;