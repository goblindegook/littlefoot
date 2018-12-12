import test from 'tape'
import littlefoot from '../src/'
import { setup, sleep, teardown } from './helper'
const fs = require('fs')

test('setup with custom contentTemplate', async t => {
  setup('default')

  const lf = littlefoot({
    contentTemplate: fs.readFileSync(
      `${__dirname}/fixtures/contentTemplate.html`
    )
  })
  const delay = lf.getSetting('activateDelay')
  const buttonSelector = 'button[data-footnote-id="1"]'
  const button = document.body.querySelector(buttonSelector)

  t.notOk(
    document.body.querySelector('aside.custom'),
    'content is not shown until activation'
  )

  lf.activate(buttonSelector)

  await sleep(delay)

  const footnote = document.body.querySelector('aside.custom')
  const content = footnote.querySelector('.littlefoot-footnote__content')

  t.ok(footnote, 'custom footnote content instantiated')

  t.equal(footnote.getAttribute('data-footnote-id'), '1', 'replaces id token')
  t.equal(
    footnote.getAttribute('data-footnote-number'),
    '1',
    'replaces number token'
  )

  t.equal(
    content.innerHTML.trim(),
    button.getAttribute('data-footnote-content').trim(),
    'injects content into popover'
  )

  teardown()
  t.end()
})
