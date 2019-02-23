import { setDocumentBody, getAllButtons } from '../helper'
import littlefoot from '../../src'

beforeEach(() => {
  setDocumentBody('multiple.html')
})

test('setup with numberResetSelector creates footnotes with duplicate numbers', () => {
  littlefoot({ numberResetSelector: 'article' })
  const buttons = getAllButtons()
  expect(
    buttons.map(button => button.getAttribute('data-footnote-number'))
  ).toEqual(['1', '1', '1', '1'])
})

test('setup without numberResetSelector creates footnotes with unique numbers', () => {
  littlefoot({ numberResetSelector: undefined })
  const buttons = getAllButtons()
  expect(
    buttons.map(button => button.getAttribute('data-footnote-number'))
  ).toEqual(['1', '2', '3', '4'])
})
