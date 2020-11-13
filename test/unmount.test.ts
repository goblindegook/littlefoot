import littlefoot from '../src/littlefoot'
import { screen } from '@testing-library/dom'
import { setDocumentBody } from './helper'

beforeEach(() => {
  setDocumentBody('default.html')
})

test('unmount removes all buttons', () => {
  const instance = littlefoot()
  instance.unmount()
  expect(document.querySelectorAll('.littlefoot__host')).toHaveLength(0)
  expect(
    screen.queryAllByRole('button', { name: /See Footnote/ })
  ).toHaveLength(0)
})

test('unmount unhides all footnotes', () => {
  const instance = littlefoot()
  instance.unmount()
  expect(document.querySelectorAll('.littlefoot--print')).toHaveLength(0)
})
