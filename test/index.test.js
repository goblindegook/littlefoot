import classList from 'dom-classlist'
import test from 'tape'
import littlefoot from '../src/'
import { dispatchEvent } from '../src/dom/events'
import { setup, sleep, teardown } from './helper'

test('littlefoot setup with default options', (t) => {
  setup('default.html')

  const body             = document.body
  const footnotes        = body.querySelectorAll('.footnote').length
  const reverseFootnotes = body.querySelectorAll('.reversefootnote').length

  littlefoot()

  t.equal(body.querySelectorAll('.littlefoot-footnote__container').length, footnotes,
    'inserts footnote containers')

  t.equal(body.querySelectorAll('button').length, footnotes,
    'inserts footnote buttons')

  t.equal(body.querySelectorAll('.footnote-processed').length, reverseFootnotes,
    'processes footnotes')

  t.equal(body.querySelectorAll('.footnotes').length, 1,
    'adds a footnote container')

  t.equal(body.querySelectorAll('.footnotes.footnote-print-only').length, 1,
    'hides the footnote container')

  t.equal(body.querySelectorAll('hr.footnote-print-only').length, 1,
    'hides the footnote separator')

  t.equal(body.querySelectorAll('li.footnote-print-only').length, reverseFootnotes,
    'hides all footnotes')

  t.equal(body.querySelectorAll('button.is-active').length, 0,
    'has no active footnotes')

  teardown()
  t.end()
})

test('footnote activation and dismissal', (t) => {
  setup('default.html')

  const lf = littlefoot()

  const activateDelay = lf.getSetting('activateDelay')
  const dismissDelay  = lf.getSetting('dismissDelay')
  const footnote      = document.body.querySelector('button[data-footnote-id="1"]')

  // these do nothing
  lf.activate()
  lf.activate('')

  // activate button
  lf.activate('button[data-footnote-id="1"]')

  sleep(activateDelay)
    .then(() => {
      const content = document.body.querySelector('.littlefoot-footnote__content')

      t.equal(content.innerHTML, footnote.getAttribute('data-littlefoot-footnote'),
        'injects content into popover')

      t.equal(document.body.querySelectorAll('button.is-active').length, 1,
        'activates one popover on activate()')

      lf.dismiss()
      return sleep(dismissDelay)
    })
    .then(() => {
      t.notOk(classList(footnote).contains('is-active'),
        'dismisses popovers on dismiss()')

      dispatchEvent(footnote, 'click')

      t.ok(classList(footnote).contains('changing'),
        'transitions popover activation on click')

      return sleep(activateDelay)
    })
    .then(() => {
      t.ok(classList(footnote).contains('is-active'),
        'activates one popover on button click event')

      dispatchEvent(document.body, 'click')
      return sleep(dismissDelay)
    })
    .then(() => {
      t.notOk(classList(footnote).contains('is-active'),
        'dismisses popovers on body click event')

      dispatchEvent(footnote, 'click')
      return sleep(activateDelay)
    })
    .then(() => {
      dispatchEvent(footnote, 'click')
      return sleep(dismissDelay)
    })
    .then(() => {
      t.notOk(classList(footnote).contains('is-active'),
        'dismisses popovers on activating twice')

      teardown()
      t.end()
    })
})
