import { useRef, useEffect } from "react";

function useDelayedEffect(
    effect: () => void,
    deps?: any[]
) {
    const fired = useRef(false);

    useEffect(() => {
        if (!fired.current) {
            fired.current = true;
            return;
        }

        effect();
    }, deps);
}

export default useDelayedEffect;