import { test, expect, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/dom'
import littlefoot from '../src/littlefoot'
import {
  setDocumentBody,
  getAllButtons,
  getAllActiveButtons,
  getButton,
  getPopover,
} from './helper'

beforeEach(() => {
  setDocumentBody('default.html')
})

test('creates one button and one host per footnote call', () => {
  littlefoot()
  expect(document.querySelectorAll('.littlefoot')).toHaveLength(4)
  expect(getAllButtons()).toHaveLength(4)
})

test('processes each called footnote', () => {
  littlefoot()
  expect(document.querySelectorAll('.footnotes')).toHaveLength(1)
})

test('hides all footnotes', () => {
  littlefoot()
  expect(
    document.querySelectorAll('.footnotes.littlefoot--print')
  ).toHaveLength(1)
  expect(document.querySelectorAll('hr.littlefoot--print')).toHaveLength(1)
  expect(document.querySelectorAll('li.littlefoot--print')).toHaveLength(3)
})

test('starts with no active footnotes', () => {
  littlefoot()
  expect(getAllActiveButtons()).toHaveLength(0)
})

test('sets ARIA attributes on button', () => {
  littlefoot()
  const button = getButton('1')
  expect(button).toHaveAttribute('aria-expanded', 'false')
})

test('sets up footnotes with a URL before the fragment', () => {
  setDocumentBody('filename.html')
  littlefoot()
  expect(document.querySelectorAll('.littlefoot')).toHaveLength(1)
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
  const content = getPopover('1').querySelector('.littlefoot__content')
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

test('footnote button accessibility', async () => {
  littlefoot()
  const button = getButton('1')

  expect(button).toHaveAccessibleName()
  expect(button).toHaveAccessibleDescription()
})
