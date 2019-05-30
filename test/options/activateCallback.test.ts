import { fireEvent } from '@testing-library/dom'
import { setDocumentBody, getPopover, getButton } from '../helper'
import littlefoot from '../../src'

test('setup with activateCallback', () => {
  setDocumentBody('single.html')
  const activateCallback = jest.fn()
  littlefoot({ activateCallback })

  const button = getButton('1')
  fireEvent.click(button)

  const popover = getPopover('1')
  expect(activateCallback).toHaveBeenCalledWith(popover, button)
})
