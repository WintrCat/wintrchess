import { RefObject, useEffect, useState } from "react";

/**
 * @description The inner width / height does not include border or scrollbar.
 * The full width / height does. If inner width != full width, you can detect
 * the existence of a scrollbar (you may have to subtract width of border * 2)
 */
function useResizeObserver<ElementType extends HTMLElement>(
    elementRef: RefObject<ElementType>,
    defaultSizes = 0
) {
    const [ size, setSize ] = useState({
        innerWidth: defaultSizes,
        innerHeight: defaultSizes,
        fullWidth: defaultSizes,
        fullHeight: defaultSizes
    });

    useEffect(() => {
        if (!elementRef.current) return;

        const observer = new ResizeObserver(entries => {
            const element = entries[0].target as ElementType;

            setSize({
                innerWidth: element.clientWidth,
                innerHeight: element.clientHeight,
                fullWidth: element.offsetWidth,
                fullHeight: element.offsetHeight
            });
        });

        observer.observe(elementRef.current);

        return () => observer.disconnect();
    }, []);

    return size;
}

export default useResizeObserver;