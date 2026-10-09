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

export const isImageUrl = (url?: string): boolean => {
  if (!url) return false;
  const clean = url.trim().toLowerCase().split('?')[0].split('#')[0];
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif', '.bmp', '.ico'];
  return imageExtensions.some((ext) => clean.endsWith(ext));
};

export const isDirectVideoUrl = (url?: string): boolean => {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  // Never consider image URLs as direct videos
  if (isImageUrl(trimmed)) {
    return false;
  }

  const lower = trimmed.toLowerCase();
  const clean = lower.split('?')[0].split('#')[0];

  const videoExtensions = ['.mp4', '.webm', '.mov', '.m4v', '.ogv', '.m3u8', '.ogg', '.mkv'];
  if (videoExtensions.some((ext) => clean.endsWith(ext))) {
    return true;
  }

  if (lower.startsWith('blob:')) {
    return true;
  }

  // Explicit video paths or query parameters
  if (
    clean.includes('/videos/') ||
    clean.includes('/video/') ||
    lower.includes('format=mp4') ||
    lower.includes('type=video') ||
    lower.includes('video/mp4')
  ) {
    return true;
  }

  return false;
};

export const getYouTubeThumbnail = (url?: string, embedId?: string): string | null => {
  if (url && isDirectVideoUrl(url)) {
    return null;
  }
  const ytId = extractYouTubeId(url) || (embedId && extractYouTubeId(embedId) ? extractYouTubeId(embedId) : embedId);
  if (ytId && /^[a-zA-Z0-9_-]{11}$/.test(ytId)) {
    return `https://i.ytimg.com/vi/${ytId}/oar2.jpg`;
  }
  return null;
};

/**
 * Fetches channel videos (including Shorts) via the Uploads Playlist endpoint.
 */
export const fetchYouTubeVideos = async (apiKey: string, channelId: string): Promise<YouTubeVideo[]> => {
  const targetChannelId = channelId || 'UCd6RT8D4rIrSlZBUeio_Ung';
  
  // Try YouTube Data API v3 if key exists
  if (apiKey) {
    try {
      const channelRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&id=${targetChannelId}&part=contentDetails`
      );
      const channelData = await channelRes.json();

      if (channelData.items && channelData.items.length > 0) {
        const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
        const playlistRes = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${uploadsPlaylistId}&part=snippet&maxResults=10`
        );
        const playlistData = await playlistRes.json();

        if (playlistData.items && playlistData.items.length > 0) {
          return playlistData.items.map((item: any) => ({
            id: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || `https://img.youtube.com/vi/${item.snippet.resourceId.videoId}/hqdefault.jpg`,
            publishedAt: item.snippet.publishedAt,
            url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`
          }));
        }
      }
    } catch (err) {
      console.warn('YouTube Data API fetch failed or restricted, trying RSS feed fallback...', err);
    }
  }

  // Fallback: Fetch channel videos via YouTube RSS feed
  try {
    const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${targetChannelId}`
    )}`;
    const res = await fetch(rssUrl);
    const data = await res.json();

    if (data.status === 'ok' && Array.isArray(data.items) && data.items.length > 0) {
      return data.items.map((item: any) => {
        const videoId = item.guid?.replace('yt:video:', '') || extractYouTubeId(item.link) || '';
        return {
          id: videoId,
          title: item.title,
          thumbnail: item.thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          publishedAt: item.pubDate,
          url: item.link || `https://www.youtube.com/watch?v=${videoId}`
        };
      });
    }
  } catch (rssErr) {
    console.error('Failed to fetch YouTube RSS feed:', rssErr);
  }

  return [];
};
