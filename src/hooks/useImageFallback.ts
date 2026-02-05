
import { useState, useEffect } from 'react';

type ImageState = 'initial' | 'try_local_svg' | 'fallback_node' | 'dead';

/**
 * Handles image loading errors gracefully.
 * 
 * Logic:
 * 1. Try 'initial' (The URL provided in Markdown).
 * 2. If fail & was local path -> Try 'try_local_svg' (The generated placeholder /images/.../name.svg).
 * 3. If fail -> Try 'fallback_node' (/images/nodes/{nodeId}.svg).
 * 4. If fail -> 'dead' (Show No Signal).
 */
export const useImageFallback = (originalUrl?: string, nodeId?: string) => {
    const [imageState, setImageState] = useState<ImageState>('initial');
    const [activeSrc, setActiveSrc] = useState<string | undefined>(originalUrl);

    // Reset state when inputs change
    useEffect(() => {
        setImageState('initial');
        setActiveSrc(originalUrl);
    }, [originalUrl, nodeId]);

    const handleError = () => {
        // 1. Initial Load Failed
        if (imageState === 'initial') {
            if (activeSrc && activeSrc.startsWith('/') && !activeSrc.endsWith('.svg')) {
                // If it was a local file (e.g. .jpg), check if there is a generated .svg placeholder
                // This corresponds to scripts/generate-assets.js logic
                const urlParts = activeSrc.split('.');
                urlParts.pop(); // remove extension
                const svgAttempt = `${urlParts.join('.')}.svg`;
                
                console.log(`[ImageFallback] ${activeSrc} failed. Trying generated SVG: ${svgAttempt}`);
                setActiveSrc(svgAttempt);
                setImageState('try_local_svg');
            } else if (nodeId) {
                // Not local or already svg? Go straight to node fallback
                tryNodeFallback(nodeId);
            } else {
                setImageState('dead');
            }
        } 
        
        // 2. Local SVG Placeholder Failed (Or didn't exist)
        else if (imageState === 'try_local_svg') {
            if (nodeId) {
                tryNodeFallback(nodeId);
            } else {
                setImageState('dead');
            }
        }

        // 3. Node Fallback Failed
        else if (imageState === 'fallback_node') {
            console.log(`[ImageFallback] All attempts failed for ${nodeId || originalUrl}. Dead.`);
            setImageState('dead');
        }
    };

    const tryNodeFallback = (id: string) => {
        const nodeFallback = `/images/nodes/${id}.svg`;
        // Prevent infinite loop if the original URL *was* the node fallback
        if (activeSrc === nodeFallback) {
            setImageState('dead');
        } else {
            console.log(`[ImageFallback] Switching to node generic: ${nodeFallback}`);
            setActiveSrc(nodeFallback);
            setImageState('fallback_node');
        }
    };

    return {
        src: activeSrc,
        state: imageState,
        handleError,
        isDead: imageState === 'dead'
    };
};
