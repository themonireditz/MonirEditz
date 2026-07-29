export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
}

export const extractYouTubeId = (url?: string): string | null => {
  if (!url) return null;
  const trimmed = url.trim();

  // Raw 11-character YouTube video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // YouTube Shorts: youtube.com/shorts/ID or /shorts/ID
  const shortsMatch = trimmed.match(/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch) return shortsMatch[1];

  // youtu.be/ID
  const youtuBeMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);
  if (youtuBeMatch) return youtuBeMatch[1];

  // watch?v=ID or &v=ID
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
  if (watchMatch) return watchMatch[1];

  // embed/ID or /v/ID or /e/ID
  const embedMatch = trimmed.match(/(?:\/embed\/|\/v\/|\/e\/)([a-zA-Z0-9_-]{11})/i);
  if (embedMatch) return embedMatch[1];

  // Generic fallback: any 11-character string after a slash or parameter
  const fallback = trimmed.match(/(?:youtube\.com|youtu\.be).*[?&\/=]([a-zA-Z0-9_-]{11})/i);
  return fallback ? fallback[1] : null;
};

export const getYouTubeThumbnail = (url?: string, embedId?: string): string | null => {
  const ytId = extractYouTubeId(url) || (embedId && extractYouTubeId(embedId) ? extractYouTubeId(embedId) : embedId);
  if (ytId && /^[a-zA-Z0-9_-]{11}$/.test(ytId)) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }
  return null;
};

/**
 * Fetches channel videos (including Shorts) via the Uploads Playlist endpoint.
 */
export const fetchYouTubeVideos = async (apiKey: string, channelId: string): Promise<YouTubeVideo[]> => {
  try {
    // 1. Fetch channel details to retrieve the Uploads Playlist ID
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&id=${channelId}&part=contentDetails`
    );
    const channelData = await channelRes.json();

    if (!channelData.items || channelData.items.length === 0) {
      console.error('YouTube channel not found or invalid Channel ID.');
      return [];
    }

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // 2. Fetch videos directly from the Uploads Playlist
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${uploadsPlaylistId}&part=snippet&maxResults=10`
    );
    const playlistData = await playlistRes.json();

    if (!playlistData.items) {
      return [];
    }

    // 3. Map into structured YouTubeVideo objects
    return playlistData.items.map((item: any) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`
    }));

  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
};
