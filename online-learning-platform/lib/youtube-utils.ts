/**
 * Extract YouTube video ID from various YouTube URL formats
 * Handles URLs with timestamps and other query parameters
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  // Remove whitespace
  url = url.trim();

  // Match various YouTube URL patterns
  const patterns = [
    // Standard watch URLs: youtube.com/watch?v=VIDEO_ID&t=90s
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // Short URLs: youtu.be/VIDEO_ID?t=90s
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    // Embed URLs: youtube.com/embed/VIDEO_ID
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // Alternative URLs: youtube.com/v/VIDEO_ID
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    // Just the video ID itself
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Get YouTube embed URL from video ID or full URL
 * Preserves timestamp if present in the original URL
 */
export function getYouTubeEmbedUrl(videoIdOrUrl: string): string {
  // If it's already a full URL, extract video ID and timestamp
  if (videoIdOrUrl.includes('youtube.com') || videoIdOrUrl.includes('youtu.be')) {
    const videoId = extractYouTubeVideoId(videoIdOrUrl);
    if (!videoId) return `https://www.youtube.com/embed/${videoIdOrUrl}`;
    
    // Extract timestamp if present
    const timestampMatch = videoIdOrUrl.match(/[?&]t=(\d+[smh]?)/);
    const timestamp = timestampMatch ? timestampMatch[1] : null;
    
    if (timestamp) {
      // Convert timestamp to seconds if needed
      let seconds = 0;
      if (timestamp.endsWith('s')) {
        seconds = parseInt(timestamp.slice(0, -1));
      } else if (timestamp.endsWith('m')) {
        seconds = parseInt(timestamp.slice(0, -1)) * 60;
      } else if (timestamp.endsWith('h')) {
        seconds = parseInt(timestamp.slice(0, -1)) * 3600;
      } else {
        seconds = parseInt(timestamp);
      }
      return `https://www.youtube.com/embed/${videoId}?start=${seconds}`;
    }
    
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // If it's just a video ID
  return `https://www.youtube.com/embed/${videoIdOrUrl}`;
}
