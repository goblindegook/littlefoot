import littlefoot from '../src'
import {
  setup,
  getButton,
  queryAllButtons,
  queryAllActiveButtons,
  queryAll
} from './helper'

beforeEach(() => {
  setup('default.html')
})

test('creates one button and one container per footnote call', () => {
  littlefoot()
  expect(queryAll('.littlefoot-footnote__container')).toHaveLength(4)
  expect(queryAllButtons()).toHaveLength(4)
})

test('processes each called footnote', () => {
  littlefoot()
  expect(queryAll('.footnote-processed')).toHaveLength(3)
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
  expect(queryAllActiveButtons()).toHaveLength(0)
})

test('sets ARIA attributes on button', () => {
  littlefoot()
  const button = getButton('1')
  expect(button).toHaveAttribute('aria-expanded', 'false')
  expect(button).toHaveAttribute('aria-label', 'Footnote 1')
})
