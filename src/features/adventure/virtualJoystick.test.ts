import { describe, expect, it } from 'vitest'
import { getVirtualJoystickDirections } from './virtualJoystick'

describe('getVirtualJoystickDirections', () => {
  it('returns no direction inside the central dead zone', () => {
    expect(getVirtualJoystickDirections(4, -5, 8)).toEqual([])
  })

  it('selects the cardinal direction followed by the pointer', () => {
    expect(getVirtualJoystickDirections(42, -3, 8)).toEqual(['right'])
    expect(getVirtualJoystickDirections(2, -38, 8)).toEqual(['up'])
    expect(getVirtualJoystickDirections(-36, 3, 8)).toEqual(['left'])
    expect(getVirtualJoystickDirections(1, 44, 8)).toEqual(['down'])
  })

  it('combines both axes in diagonal sectors', () => {
    expect(getVirtualJoystickDirections(30, -28, 8)).toEqual(['up', 'right'])
    expect(getVirtualJoystickDirections(-26, 31, 8)).toEqual(['down', 'left'])
  })
})
