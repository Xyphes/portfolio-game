import { adventureWorld } from '../../content/adventure.data'
import { getContentReferenceKey, type ContentReference } from '../../content/adventure.schema'
import { addDiscovery, addFragment, type ProgressState } from '../../domain/progression'

export function collectContentProgress(
  progress: ProgressState,
  reference: ContentReference,
): ProgressState {
  const contentKey = getContentReferenceKey(reference)
  const sourceScreen = adventureWorld.screens.find((screen) =>
    screen.contentRefs.some((candidate) => getContentReferenceKey(candidate) === contentKey))
  const discovered = addDiscovery(progress, contentKey)

  return sourceScreen?.fragment
    ? addFragment(discovered, sourceScreen.fragment.id)
    : discovered
}
