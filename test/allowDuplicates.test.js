import test from 'tape'
import littlefoot from '../src/'
import { setup, teardown } from './helper'

test('setup with allowDuplicates=false', (t) => {
  setup('default')

  littlefoot({ allowDuplicates: false })

  const buttons = document.body.querySelectorAll('[data-footnote-content]')
  const processed = document.body.querySelectorAll('.footnote-processed')

  t.equal(buttons.length, processed.length,
    'creates one button per footnote ignoring duplicates')

  teardown()
  t.end()
})

test('setup with allowDuplicates=true', (t) => {
  setup('default')

  littlefoot({ allowDuplicates: true })

  const buttons = document.body.querySelectorAll('[data-footnote-content]')
  const processed = document.body.querySelectorAll('.footnote-processed')

  t.ok(buttons.length > processed.length,
    'creates more buttons than footnotes with duplicates')

  teardown()
  t.end()
})

test('setup with allowDuplicates=true', (t) => {
  setup('multiple')

  littlefoot({ allowDuplicates: false })

  const buttons = document.body.querySelectorAll('[data-footnote-content]')
  const processed = document.body.querySelectorAll('.footnote-processed')

  t.equal(buttons.length, processed.length,
    'creates all footnotes when duplicates are in different containers')

  teardown()
  t.end()
})
