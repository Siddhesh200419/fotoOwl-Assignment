/** Cached thumbnail size used in the gallery grid. */
export function getThumbnailUrl(id: string): string {
  return `https://picsum.photos/id/${id}/400/300`;
}

/** Detail view — large enough to look sharp, small enough to load quickly. */
export function getDetailUrl(id: string): string {
  return `https://picsum.photos/id/${id}/1200/900`;
}

/** Download / share — same moderate size for reliability and speed. */
export function getDownloadUrl(id: string): string {
  return `https://picsum.photos/id/${id}/1200/900`;
}
