
import { MediaType } from "../types";

/**
 * Safely appends a custom 'poster' parameter to a URL.
 */
export const attachPosterToUrl = (url: string, posterUrl?: string): string => {
    if (!posterUrl || !url) return url;
    try {
        const separator = url.includes('?') ? '&' : '?';
        return `${url.trim()}${separator}__poster=${encodeURIComponent(posterUrl.trim())}`;
    } catch (e) {
        return url;
    }
};

/**
 * Extracts the original media URL and the custom poster URL.
 */
export const detachPosterFromUrl = (fullUrl: string): { cleanUrl: string; poster?: string } => {
    if (!fullUrl) return { cleanUrl: '' };
    
    // Quick check to avoid regex if no poster exists
    if (!fullUrl.includes('__poster=')) {
        return { cleanUrl: fullUrl };
    }

    // Use regex to carefully extract just our param
    const match = fullUrl.match(/[?&]__poster=([^&]*)/);
    if (match) {
        let poster: string;
        try {
            poster = decodeURIComponent(match[1]);
        } catch (e) {
            // Malformed percent-encoding — return original URL unchanged
            return { cleanUrl: fullUrl };
        }
        // Remove the parameter string from the URL
        let cleanUrl = fullUrl.replace(match[0], '');
        // If __poster was the first query param (match[0] starts with '?'),
        // any remaining params now begin with '&' — replace the leading '&' with '?'
        if (match[0].startsWith('?') && cleanUrl.includes('&') && !cleanUrl.includes('?')) {
            cleanUrl = cleanUrl.replace('&', '?');
        }
        // Fix potential dangling '?'
        if (cleanUrl.endsWith('?')) cleanUrl = cleanUrl.slice(0, -1);

        return { cleanUrl, poster };
    }
    
    return { cleanUrl: fullUrl };
};

export const getMediaType = (url?: string): MediaType => {
    if (!url) return 'unknown';
    
    const { cleanUrl } = detachPosterFromUrl(url);
    const lowerUrl = cleanUrl.toLowerCase();

    // 1. External Providers
    if (lowerUrl.match(/(youtube\.com|youtu\.be|vimeo\.com|dzen\.ru)/)) return 'video';

    // 2. Extensions (Strip query params first)
    const cleanPath = lowerUrl.split('?')[0];
    
    if (cleanPath.match(/\.(mp4|webm|mov|m4v)$/)) return 'video';
    if (cleanPath.match(/\.(mp3|wav|ogg|m4a)$/)) return 'audio';
    if (cleanPath.match(/\.(jpg|jpeg|png|gif|svg|webp|bmp|ico)$/)) return 'image';
    
    // 3. Known Patterns
    if (lowerUrl.includes('images.unsplash.com')) return 'image';

    // 4. URL Params (for signed URLs like Yandex/S3)
    try {
        const urlObj = new URL(cleanUrl, 'http://d.com'); // dummy host for relative urls
        const params = urlObj.searchParams;
        const typeHint = params.get('content_type') || params.get('media_type') || params.get('mime') || '';
        
        if (typeHint.includes('video')) return 'video';
        if (typeHint.includes('audio')) return 'audio';
        if (typeHint.includes('image')) return 'image';
    } catch (e) {}

    // Default fallback
    return 'image';
};

export const getDefaultNodeImage = (id: string): string => {
  return `/images/nodes/${id}.svg`;
};
