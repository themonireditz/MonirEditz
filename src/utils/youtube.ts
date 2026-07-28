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

