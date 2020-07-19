import { fireEvent } from '@testing-library/dom'
import littlefoot from '../src'
import {
  setDocumentBody,
  getAllButtons,
  getAllActiveButtons,
  queryAll,
  getButton,
  getPopover,
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
  expect(getAllActiveButtons()).toEqual([])
})

test('sets ARIA attributes on button', () => {
  littlefoot()
  const button = getButton('1')
  expect(button).toHaveAttribute('aria-expanded', 'false')
})

test('sets up footnotes with a URL before the fragment', () => {
  setDocumentBody('filename.html')
  littlefoot()
  expect(queryAll('.littlefoot-footnote__host')).toHaveLength(1)
  expect(getAllButtons()).toHaveLength(1)
})

test('strips backlink and its enclosing tags from the footnote body', () => {
  setDocumentBody('backlink.html')
  littlefoot({ activateDelay: 1 })
  fireEvent.click(getButton('1'))
  expect(getPopover('1').querySelector('sup')).toBeNull()
})

test('strips backlink and its enclosing tags when they contain whitespace', () => {
  setDocumentBody('backlink.html')
  littlefoot({ activateDelay: 1 })
  fireEvent.click(getButton('2'))
  expect(getPopover('2').querySelector('sup')).toBeNull()
})

test('preserves empty tags and square brackets elsewhere in the footnote body', () => {
  setDocumentBody('backlink.html')
  littlefoot({ activateDelay: 1 })
  fireEvent.click(getButton('1'))
  const content = getPopover('1').querySelector('.littlefoot-footnote__content')
  expect(content?.querySelector('hr')).not.toBeNull()
  expect(content).toContainHTML(
    `This footnote has a backlink wrapped in [] and an element.`
  )
})

test('wraps bare footnote body in a paragraph tag', () => {
  setDocumentBody('barebody.html')
  littlefoot({ activateDelay: 1 })
  fireEvent.click(getButton('1'))
  expect(getPopover('1').querySelector('p')).toContainHTML(
    'The original footnote body is bare.'
  )
})
