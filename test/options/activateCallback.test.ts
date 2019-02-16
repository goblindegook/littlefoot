import { fireEvent } from 'dom-testing-library'
import { setup, getButton, getPopover } from '../helper'
import littlefoot from '../../src'

test('setup with activateCallback', () => {
  setup('default.html')
  const activateCallback = jest.fn()
  littlefoot({ activateCallback })
  const button = getButton('1')

  fireEvent.click(button)

  const popover = getPopover('1')
  expect(activateCallback).toHaveBeenCalledWith(popover, button)
})
