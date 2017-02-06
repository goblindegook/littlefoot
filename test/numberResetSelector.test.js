import test from 'tape'
import littlefoot from '../src/'
import { setup, teardown } from './helper'

test('littlefoot setup with numberResetSelector', (t) => {
  setup('multiple.html')

  littlefoot({ numberResetSelector: 'article' })

  const buttons = document.querySelectorAll('button[data-footnote-id]')
  const numbers = Array.prototype.map.call(buttons,
    (button) => button.getAttribute('data-footnote-number'))

  t.notEqual(numbers.length, new Set(numbers).size,
    'should yield footnotes with duplicate numbering')

  teardown()
  t.end()
})

test('littlefoot setup without numberResetSelector', (t) => {
  setup('multiple.html')

  littlefoot({ numberResetSelector: null })

  const buttons = document.querySelectorAll('button[data-footnote-id]')
  const numbers = Array.prototype.map.call(buttons,
    (button) => button.getAttribute('data-footnote-number'))

  t.equal(numbers.length, new Set(numbers).size,
    'should yield footnotes with unique numbering')

  teardown()
  t.end()
})
