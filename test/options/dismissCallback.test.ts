import { fireEvent } from '@testing-library/dom'
import { expect, test, vi } from 'vitest'
import littlefoot from '../../src/littlefoot'
import {
  getButton,
  getPopover,
  setDocumentBody,
  waitToStopChanging,
} from '../helper'

test('setup with dismissCallback', async () => {
  setDocumentBody('single.html')
  const dismissCallback = vi.fn()
  littlefoot({ dismissCallback })

  const button = getButton('1')

  fireEvent.click(button)
  await waitToStopChanging(button)

  fireEvent.click(button)
  const popover = getPopover('1')
  await waitToStopChanging(button)

  expect(dismissCallback).toHaveBeenCalledTimes(1)
  expect(dismissCallback).toHaveBeenCalledWith(popover, button)
})

test('dismissCallback can be set after initialisation', async () => {
  setDocumentBody('single.html')
  const dismissCallback = vi.fn()

  const instance = littlefoot()
  instance.updateSetting('dismissCallback', dismissCallback)

  const button = getButton('1')

  fireEvent.click(button)
  await waitToStopChanging(button)

  fireEvent.click(button)
  const popover = getPopover('1')
  await waitToStopChanging(button)

  expect(dismissCallback).toHaveBeenCalledTimes(1)
  expect(dismissCallback).toHaveBeenCalledWith(popover, button)
})
