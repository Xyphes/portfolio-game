import { describe, expect, it } from 'vitest'
import { collectInterestMedia } from './interestMedia'

describe('collectInterestMedia', () => {
  it('interleaves photos and videos by filename within the chosen activity', () => {
    const media = collectInterestMedia('climbing', {
      '../../assets/interests-optimized/climbing/01-first.jpg': '/first.jpg',
      '../../assets/interests-optimized/climbing/03-last.jpg': '/last.jpg',
      '../../assets/interests-optimized/jewelry/01-other.jpg': '/other.jpg',
    }, {
      '../../assets/interests/climbing/02-action.mp4': '/action.mp4',
      '../../assets/interests/jewelry/02-other.webm': '/other.webm',
    })

    expect(media.map(({ kind, src }) => [kind, src])).toEqual([
      ['photo', '/first.jpg'],
      ['video', '/action.mp4'],
      ['photo', '/last.jpg'],
    ])
  })
})
