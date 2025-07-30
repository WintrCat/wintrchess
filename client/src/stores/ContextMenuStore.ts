import { create } from "zustand";

interface ContextMenuStore {
    openId: string;

    setOpenId: (id: string) => void;
}

const useContextMenuStore = create<ContextMenuStore>(set => ({
    openId: "",

    setOpenId(id) {
        set({ openId: id });
    }
}));

export default useContextMenuStore;