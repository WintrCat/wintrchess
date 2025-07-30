import {
    useState,
    useEffect,
    useRef,
    MouseEvent
} from "react";
import { uniqueId } from "lodash-es";

import { ContextMenuPosition } from "@/components/common/ContextMenu/types";
import useContextMenuStore from "@/stores/ContextMenuStore";

function useContextMenu() {
    const { openId, setOpenId } = useContextMenuStore();

    const contextMenuIdRef = useRef(uniqueId());

    const [
        contextMenuPosition,
        setContextMenuPosition
    ] = useState<ContextMenuPosition>();

    function closeContextMenu() {
        setContextMenuPosition(undefined);

        removeEventListener("click", closeContextMenu);
        removeEventListener("scroll", closeContextMenu);
    }

    useEffect(() => {
        if (openId == contextMenuIdRef.current) return;

        closeContextMenu();
    }, [openId]);

    return {
        contextMenuPosition: contextMenuPosition,
        openContextMenu: (event: MouseEvent) => {
            event.preventDefault();

            setOpenId(contextMenuIdRef.current);
    
            setContextMenuPosition({
                x: event.clientX,
                y: event.clientY
            });
    
            addEventListener("click", closeContextMenu);
            addEventListener("scroll", closeContextMenu, { capture: true });
        }
    };
}

export default useContextMenu;