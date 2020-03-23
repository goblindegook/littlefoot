import { setDocumentBody, getAllButtons } from '../helper'
import littlefoot from '../../src'

beforeEach(() => {
  setDocumentBody('multiple.html')
})

test('setup with numberResetSelector creates footnotes with duplicate numbers', () => {
  littlefoot({ numberResetSelector: 'article' })
  const buttons = getAllButtons()
  const buttonNumbers = buttons.map((button) => button.dataset.footnoteNumber)
  expect(buttonNumbers).toEqual(['1', '2', '1', '2', '3'])
})

test('setup without numberResetSelector creates footnotes with unique numbers', () => {
  littlefoot({ numberResetSelector: undefined })
  const buttons = getAllButtons()
  const buttonNumbers = buttons.map((button) => button.dataset.footnoteNumber)
  expect(buttonNumbers).toEqual(['1', '2', '3', '4', '5'])
})
