export const isVideoUrl = (url?: string | null) => {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return [".mp4", ".webm", ".mov", ".m4v", ".ogg", ".avi", ".mkv"].some(
    (ext) => clean.endsWith(ext)
  );
};

export const getPrimaryImageUrl = (
  media: { url: string }[],
  fallback = "/placeholder.svg"
) => {
  const firstImage = media.find((item) => !isVideoUrl(item.url));
  return firstImage?.url ?? fallback;
};
