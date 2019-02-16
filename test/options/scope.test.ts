import littlefoot from '../../src'
import { setup } from '../helper'

test('creates buttons for all footnotes when scope is body', () => {
  setup('default.html')

  littlefoot({ scope: 'body' })

  expect(document.querySelectorAll('[data-footnote-content]')).toHaveLength(4)
  expect(document.querySelectorAll('.footnote-processed')).toHaveLength(3)
})

test('creates no footnote buttons when scope is invalid', () => {
  setup('default.html')

  littlefoot({ scope: '#invalid' })

  expect(document.querySelectorAll('[data-footnote-content]')).toHaveLength(0)
  expect(document.querySelectorAll('.footnote-processed')).toHaveLength(0)
})
