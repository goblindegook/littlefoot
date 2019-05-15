import littlefoot from '../src'
import { setDocumentBody, getAllButtons, queryAll } from './helper'

beforeEach(() => {
  setDocumentBody('default.html')
})

test('unmount removes all buttons', () => {
  const instance = littlefoot()
  instance.unmount()
  expect(queryAll('.littlefoot-footnote__host')).toHaveLength(0)
  expect(getAllButtons()).toHaveLength(0)
})

test('unmount unhides all footnotes', () => {
  const instance = littlefoot()
  instance.unmount()
  expect(queryAll('.footnote-print-only')).toHaveLength(0)
})
