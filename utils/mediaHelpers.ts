
import { MediaType } from "../types";

export const getMediaType = (url?: string): MediaType => {
    if (!url) return 'unknown';
    
    // Remove query parameters for extension checking
    const cleanUrl = url.split('?')[0].toLowerCase();
    
    if (cleanUrl.match(/\.(mp4|webm|mov|m4v)$/)) return 'video';
    if (cleanUrl.match(/\.(mp3|wav|ogg|m4a)$/)) return 'audio';
    if (cleanUrl.match(/\.(jpg|jpeg|png|gif|svg|webp|bmp|ico)$/)) return 'image';
    
    // Default fallback heuristics
    if (url.includes('images.unsplash.com')) return 'image';
    if (url.includes('youtube.com') || url.includes('vimeo.com')) return 'video';

    // If no extension is found but we have a url, treat as image for safety in this context
    return 'image';
};
