// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createAdventureGame } from '../../game/createAdventureGame'
import { AdventureBridge } from '../../game/bridge/AdventureBridge'
import { PhaserHost } from './PhaserHost'

vi.mock('../../game/createAdventureGame', () => ({
  createAdventureGame: vi.fn(),
}))

const createAdventureGameMock = vi.mocked(createAdventureGame)

describe('PhaserHost', () => {
  beforeEach(() => createAdventureGameMock.mockReset())

  it('offers a classic fallback and can retry after a loading failure', async () => {
    const destroy = vi.fn()
    createAdventureGameMock
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({ destroy } as never)

    const { unmount } = render(
      <MemoryRouter>
        <PhaserHost
          bridge={new AdventureBridge()}
          locale="en"
          screenId="study-ruins"
          tutorialCompleted
        />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('alert')).toHaveTextContent('The world could not be loaded')
    expect(screen.getByText('Study archives')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open classic mode' })).toHaveAttribute('href', '/en/classic')
    expect(screen.getByRole('button', { name: 'Try again' })).toHaveFocus()

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(screen.getByRole('status')).toHaveTextContent('Loading the world')
    await waitFor(() => expect(createAdventureGameMock).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())

    unmount()
    expect(destroy).toHaveBeenCalledWith(true)
  })
})
