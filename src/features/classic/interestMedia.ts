export type InterestMedia = {
  path: string
  src: string
  kind: 'photo' | 'video'
}

export function collectInterestMedia(
  folder: string,
  photoUrls: Record<string, string>,
  videoUrls: Record<string, string>,
): InterestMedia[] {
  const photos = Object.entries(photoUrls)
    .filter(([path]) => path.includes(`/interests-optimized/${folder}/`))
    .map(([path, src]) => ({ path, src, kind: 'photo' as const }))
  const videos = Object.entries(videoUrls)
    .filter(([path]) => path.includes(`/interests/${folder}/`))
    .map(([path, src]) => ({ path, src, kind: 'video' as const }))

  return [...photos, ...videos].sort((left, right) => {
    const leftName = left.path.slice(left.path.lastIndexOf('/') + 1)
    const rightName = right.path.slice(right.path.lastIndexOf('/') + 1)
    return leftName.localeCompare(rightName) || left.path.localeCompare(right.path)
  })
}
