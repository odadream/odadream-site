
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to detect if an element has overflow content 
 * and control scroll indicators (left/right arrows).
 * 
 * @param ref - Reference to the scrollable HTML element
 * @param dependencies - Array of dependencies that might change scroll width (e.g., path, content)
 * @returns { canScrollLeft, canScrollRight, scroll }
 */
export const useScrollOverflow = (
    ref: React.RefObject<HTMLElement>, 
    dependencies: any[] = []
) => {
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = useCallback(() => {
        if (ref.current) {
            const { scrollWidth, clientWidth, scrollLeft } = ref.current;
            // Add a small buffer (2px) to prevent flickering on exact matches due to sub-pixel rendering
            setCanScrollRight(scrollWidth > clientWidth + scrollLeft + 2);
            setCanScrollLeft(scrollLeft > 0);
        }
    }, [ref]);

    // Check on mount, resize, and dependency change
    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        
        // Initial scroll to end if needed (optional behavior, usually for breadcrumbs)
        // For general usage, we just check.
        
        return () => window.removeEventListener('resize', checkScroll);
    }, [checkScroll, ...dependencies]);

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
