import { test, expect, beforeEach } from 'vitest'
import littlefoot from '../src/littlefoot'
import { screen } from '@testing-library/dom'
import { setDocumentBody } from './helper'

beforeEach(() => {
  setDocumentBody('default.html')
})

test('unmount removes all buttons', () => {
  const instance = littlefoot()
  instance.unmount()
  expect(document.querySelectorAll('.littlefoot')).toHaveLength(0)
  expect(
    screen.queryByRole('button', { name: /See Footnote/ })
  ).not.toBeInTheDocument()
})

test('unmount unhides all footnotes', () => {
  const instance = littlefoot()
  instance.unmount()
  expect(document.querySelectorAll('.littlefoot--print')).toHaveLength(0)
})
