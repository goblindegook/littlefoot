import test from 'tape'
import littlefoot from '../src/'
import { setup, teardown } from './helper'

test('setup with default buttonTemplate', (t) => {
  setup('default')

  littlefoot()

  const footnotes = document.body.querySelectorAll('.footnote')
  const buttons = document.body.querySelectorAll('button')

  t.equal(buttons.length, footnotes.length, 'one custom button created per footnote')
  t.equal(buttons[0].id, 'fnref:1', 'replaces reference token')
  t.equal(buttons[0].getAttribute('data-footnote-id'), '1', 'replaces id token')
  t.equal(buttons[0].getAttribute('data-footnote-number'), '1', 'replaces number token')

  teardown()
  t.end()
})

test('setup with custom buttonTemplate', (t) => {
  setup('default')

  littlefoot({ buttonTemplate: require('./fixtures/buttonTemplate.html') })

  const footnotes = document.body.querySelectorAll('.footnote')
  const buttons = document.body.querySelectorAll('button.custom')

  t.equal(buttons.length, footnotes.length, 'one custom button created per footnote')
  t.equal(buttons[0].getAttribute('data-id'), '1', 'replaces id token')
  t.equal(buttons[0].getAttribute('data-number'), '1', 'replaces number token')
  t.equal(buttons[0].getAttribute('data-reference'), 'fnref:1', 'replaces reference token')
  t.ok(/This is footnote 1/.test(buttons[0].getAttribute('data-content')), 'replaces content token')

  teardown()
  t.end()
})
