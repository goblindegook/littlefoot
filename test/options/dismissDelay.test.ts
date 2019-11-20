import { fireEvent } from '@testing-library/dom'
import { setDocumentBody, getButton } from '../helper'
import littlefoot from '../../src'

afterEach(jest.useRealTimers)

test('dismissDelay can be set after initialisation', async () => {
  jest.useFakeTimers()
  setDocumentBody('single.html')

  const instance = littlefoot({ activateDelay: 0, dismissDelay: 0 })
  instance.updateSetting('dismissDelay', 200)

  const button = getButton('1')
  fireEvent.click(button)
  jest.advanceTimersByTime(100)
  fireEvent.click(button)
  jest.advanceTimersByTime(100)

  expect(button).toHaveClass('is-changing')

  jest.advanceTimersByTime(100)

  expect(button).not.toHaveClass('is-changing')
})
