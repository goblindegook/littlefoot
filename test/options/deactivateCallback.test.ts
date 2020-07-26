import { fireEvent } from '@testing-library/dom'
import {
  setDocumentBody,
  getPopover,
  waitToStopChanging,
  getButton,
} from '../helper'
import littlefoot from '../../src'

test('setup with deactivateCallback', async () => {
  setDocumentBody('single.html')
  const deactivateCallback = jest.fn()
  littlefoot({ deactivateCallback: deactivateCallback })

  const button = getButton('1')

  fireEvent.click(button)
  await waitToStopChanging(button)
  expect(deactivateCallback).toHaveBeenCalledTimes(0)

  fireEvent.click(button)
  const popover = getPopover('1')
  await waitToStopChanging(button)

  expect(deactivateCallback).toHaveBeenCalledTimes(1)
  expect(deactivateCallback).toHaveBeenCalledWith(popover)
})

test('deactivateCallback can be set after initialisation', async () => {
  setDocumentBody('single.html')
  const deactivateCallback = jest.fn()

  const instance = littlefoot()
  instance.updateSetting('deactivateCallback', deactivateCallback)

  const button = getButton('1')

  fireEvent.click(button)
  await waitToStopChanging(button)
  expect(deactivateCallback).toHaveBeenCalledTimes(0)

  fireEvent.click(button)
  const popover = getPopover('1')
  await waitToStopChanging(button)

  expect(deactivateCallback).toHaveBeenCalledTimes(1)
  expect(deactivateCallback).toHaveBeenCalledWith(popover)
})
