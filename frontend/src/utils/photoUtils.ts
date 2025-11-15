/**
 * Utility functions for handling photo URLs
 */

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Convert relative photo URL to absolute URL with API base
 * @param url - Relative URL from database (e.g., "/uploads/users/123/photo.jpg") or external URL
 * @returns Full URL to access the photo
 */
export function getPhotoUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;

  // If URL is already absolute (starts with http:// or https://), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If URL is relative (starts with /uploads/), prepend API_URL
  if (url.startsWith('/uploads/')) {
    return `${API_URL}${url}`;
  }

  // Fallback: return URL as is
  return url;
}
