import { fireEvent } from 'dom-testing-library'
import { setup, getPopover } from '../helper'
import littlefoot from '../../src'

test('setup with activateCallback', () => {
  setup('single.html')
  const activateCallback = jest.fn()
  littlefoot({ activateCallback })

  const button = document.querySelector('button')!
  fireEvent.click(button)

  const popover = getPopover('1')
  expect(activateCallback).toHaveBeenCalledWith(popover, button)
})
