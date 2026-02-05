
import { MediaType } from "../types";

/**
 * PRODUCTION FLAG
 * Set to true only during development to test layout with random Unsplash images
 * when local assets are missing.
 */
const DEBUG_MODE_IMAGES = false; 

const DEBUG_IMAGES = [
    '1550684848-fac1c5b4e853', 
    '1451187580459-43490279c0fa', 
    '1518770660439-4636190af475', 
];

/**
 * Safely appends a custom 'poster' parameter to a URL.
 * Handles existing query strings correctly to avoid breaking signed URLs.
 * 
 * @param url The original media URL (potentially with params)
 * @param posterUrl The url of the poster image
 */
export const attachPosterToUrl = (url: string, posterUrl?: string): string => {
    if (!posterUrl) return url;
    const cleanPoster = encodeURIComponent(posterUrl.trim());
    const cleanUrl = url.trim();
    // Check if URL already has params
    const separator = cleanUrl.includes('?') ? '&' : '?';
    return `${cleanUrl}${separator}__poster=${cleanPoster}`;
};

/**
 * Extracts the original media URL and the custom poster URL.
 * Removes the custom param so the media player receives a valid signed URL.
 */
export const detachPosterFromUrl = (fullUrl: string): { cleanUrl: string; poster?: string } => {
    if (!fullUrl) return { cleanUrl: '' };
    
    let processedUrl = fullUrl.trim();
    
    // Handle HTML entities that might have leaked from markdown processing
    processedUrl = processedUrl.replace(/&amp;/g, '&');
    
    // Regex to find __poster parameter
    // Matches ?__poster=... or &__poster=...
    const posterRegex = /([?&])__poster=([^&]*)/;
    const match = processedUrl.match(posterRegex);
    
    if (match) {
        const poster = decodeURIComponent(match[2]);
        
        // Remove the parameter cleanly
        let cleanUrl = processedUrl.replace(posterRegex, '');
        
        // Fix any structural issues caused by removal
        // e.g. "url?__poster=x&b=y" -> "url&b=y" (invalid) -> "url?b=y"
        // e.g. "url?a=x&__poster=y" -> "url?a=x" (valid)
        
        // If we removed the first param (starting with ?), the next char might be &
        if (cleanUrl.includes('?&')) {
            cleanUrl = cleanUrl.replace('?&', '?');
        } else if (!cleanUrl.includes('?') && cleanUrl.includes('&')) {
             // If we have & but no ?, replace first & with ?
             // Only do this if the '&' is part of the query string area (simple heuristic)
             cleanUrl = cleanUrl.replace('&', '?');
        }
        
        // Remove trailing separators if any left
        cleanUrl = cleanUrl.replace(/[?&]$/, '');
        
        return { cleanUrl: cleanUrl.trim(), poster: poster.trim() };
    }
    
    return { cleanUrl: processedUrl };
};

export const getMediaType = (url?: string): MediaType => {
    if (!url) return 'unknown';
    
    // Clean potential metadata params before checking type
    const checkUrl = detachPosterFromUrl(url).cleanUrl;

    // 1. Check for known external video services first
    if (
        checkUrl.includes('dzen.ru') || 
        checkUrl.includes('youtube.com') || 
        checkUrl.includes('youtu.be') || 
        checkUrl.includes('vimeo.com')
    ) {
        return 'video';
    }

    // 2. Parse URL parameters for signed URLs (e.g. Yandex Disk, AWS S3)
    try {
        const urlObj = new URL(checkUrl, 'http://dummy.com');
        const params = urlObj.searchParams;
        
        const contentType = params.get('content_type') || params.get('media_type') || params.get('mime');
        if (contentType) {
            if (contentType.includes('video')) return 'video';
            if (contentType.includes('audio')) return 'audio';
            if (contentType.includes('image')) return 'image';
        }

        const filenameParam = params.get('filename');
        if (filenameParam) {
             if (filenameParam.match(/\.(mp4|webm|mov|m4v)$/i)) return 'video';
             if (filenameParam.match(/\.(mp3|wav|ogg|m4a)$/i)) return 'audio';
             if (filenameParam.match(/\.(jpg|jpeg|png|gif|svg|webp|bmp|ico)$/i)) return 'image';
        }
    } catch (e) {
        // Fallback
    }

    // 3. Extension check (Robust against query params)
    // Remove query params for extension checking
    const cleanPath = checkUrl.split('?')[0].toLowerCase();
    
    if (cleanPath.match(/\.(mp4|webm|mov|m4v)$/)) return 'video';
    if (cleanPath.match(/\.(mp3|wav|ogg|m4a)$/)) return 'audio';
    if (cleanPath.match(/\.(jpg|jpeg|png|gif|svg|webp|bmp|ico)$/)) return 'image';
    
    if (checkUrl.includes('images.unsplash.com')) return 'image';
    
    return 'image';
};

export const getDefaultNodeImage = (id: string): string => {
  if (DEBUG_MODE_IMAGES) {
    const uniqueSig = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const imgId = DEBUG_IMAGES[uniqueSig % DEBUG_IMAGES.length];
    return `https://images.unsplash.com/photo-${imgId}?auto=format&fit=crop&w=800&q=80`;
  }
  return `/images/nodes/${id}.svg`;
};
