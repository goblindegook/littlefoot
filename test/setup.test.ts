import littlefoot from '../src'
import {
  setDocumentBody,
  getAllButtons,
  getAllActiveButtons,
  queryAll,
  getButton
} from './helper'

beforeEach(() => {
  setDocumentBody('default.html')
})

test('creates one button and one host per footnote call', () => {
  littlefoot()
  expect(queryAll('.littlefoot-footnote__host')).toHaveLength(4)
  expect(getAllButtons()).toHaveLength(4)
})

test('processes each called footnote', () => {
  littlefoot()
  expect(queryAll('.footnotes')).toHaveLength(1)
})

test('hides all footnotes', () => {
  littlefoot()
  expect(queryAll('.footnotes.footnote-print-only')).toHaveLength(1)
  expect(queryAll('hr.footnote-print-only')).toHaveLength(1)
  expect(queryAll('li.footnote-print-only')).toHaveLength(3)
})

test('starts with no active footnotes', () => {
  littlefoot()
  expect(getAllActiveButtons()).toHaveLength(0)
})

test('sets ARIA attributes on button', () => {
  littlefoot()
  const button = getButton('1')
  expect(button).toHaveAttribute('aria-expanded', 'false')
  expect(button).toHaveAttribute('aria-label', 'Footnote 1')
})

test('sets up footnotes with a URL before the fragment', () => {
  setDocumentBody('filename.html')
  littlefoot()
  expect(queryAll('.littlefoot-footnote__host')).toHaveLength(1)
  expect(getAllButtons()).toHaveLength(1)
})
