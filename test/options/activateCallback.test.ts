import { fireEvent } from 'dom-testing-library'
import { setDocumentBody, getPopover, query } from '../helper'
import littlefoot from '../../src'

test('setup with activateCallback', () => {
  setDocumentBody('single.html')
  const activateCallback = jest.fn()
  littlefoot({ activateCallback })

  const button = query('button')
  fireEvent.click(button)

  const popover = getPopover('1')
  expect(activateCallback).toHaveBeenCalledWith(popover, button)
})
