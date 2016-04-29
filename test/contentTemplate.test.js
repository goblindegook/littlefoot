import test from 'tape'
import littlefoot from '../src/'
import classList from 'dom-classlist'
import { setup, sleep, teardown } from './helper'

test('littlefoot setup with custom contentTemplate', (t) => {
  setup('default.html')

  const lf             = littlefoot({ contentTemplate: require('./fixtures/contentTemplate.html') })
  const delay          = lf.getSetting('activateDelay')
  const buttonSelector = 'button[data-footnote-id="1"]'
  const button         = document.body.querySelector(buttonSelector)

  t.notOk(document.body.querySelector('aside.custom'), 'content is not shown until activation')

  lf.activate(buttonSelector)

  sleep(delay)
    .then(() => {
      const footnote = document.body.querySelector('aside.custom')
      const content  = footnote.querySelector('.littlefoot-footnote__content')

      t.ok(footnote, 'custom footnote content instantiated')

      t.equal(footnote.getAttribute('data-footnote-id'), '1', 'replaces id token')
      t.equal(footnote.getAttribute('data-footnote-number'), '1', 'replaces number token')

      t.equal(content.innerHTML.trim(), button.getAttribute('data-littlefoot-footnote').trim(),
        'injects content into popover')

      teardown()
      t.end()
    })
})
