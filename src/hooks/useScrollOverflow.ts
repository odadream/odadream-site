import React, { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to detect if an element has overflow content
 * and control scroll indicators (left/right arrows).
 *
 * @param ref - Reference to the scrollable HTML element
 * @param depKey - Stable primitive that changes when scroll width should be re-checked
 *                 (e.g. `path.map(n => n.id).join('/')`). Avoids variable-length dep arrays.
 * @returns { canScrollLeft, canScrollRight, scroll, checkScroll }
 */
export const useScrollOverflow = (
    ref: React.RefObject<HTMLElement>,
    depKey?: unknown,
) => {
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = useCallback(() => {
        if (ref.current) {
            const { scrollWidth, clientWidth, scrollLeft } = ref.current;
            // 2px buffer prevents flickering due to sub-pixel rendering
            setCanScrollRight(scrollWidth > clientWidth + scrollLeft + 2);
            setCanScrollLeft(scrollLeft > 0);
        }
    }, [ref]);

    // Check on mount, resize, and whenever depKey changes
    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [checkScroll, depKey]);

    // Scroll handler
    const scroll = useCallback((direction: 'left' | 'right', amount: number = 200) => {
        if (ref.current) {
            ref.current.scrollBy({ 
                left: direction === 'left' ? -amount : amount, 
                behavior: 'smooth' 
            });
        }
    }, [ref]);

    return { canScrollLeft, canScrollRight, checkScroll, scroll };
};