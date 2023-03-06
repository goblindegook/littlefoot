import { test, expect, afterEach, vi } from 'vitest'
import { fireEvent } from '@testing-library/dom'
import { setDocumentBody, getButton } from '../helper'
import littlefoot from '../../src/littlefoot'

afterEach(() => {
  vi.useRealTimers()
})

test('hoverDelay can be set after initialisation', () => {
  vi.useFakeTimers()
  setDocumentBody('single.html')

  const instance = littlefoot({ activateOnHover: true, hoverDelay: 0 })
  instance.updateSetting('hoverDelay', 200)

  const button = getButton('1')
  fireEvent.mouseOver(button)
  vi.advanceTimersByTime(100)

  expect(button).toHaveClass('is-changing')

  vi.advanceTimersByTime(100)

  expect(button).not.toHaveClass('is-changing')
  expect(button).toHaveClass('is-active')
})
