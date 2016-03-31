import test from 'tape'
import littlefoot from '../src/'
import { dispatchEvent } from '../src/events'
import setup from './helper/setup'
import teardown from './helper/teardown'
import sleep from './helper/sleep'

test('littlefoot setup with default options', t => {
  setup('default.html')

  const body             = document.body
  const footnotes        = body.querySelectorAll('.footnote').length
  const reverseFootnotes = body.querySelectorAll('.reversefootnote').length

  const lf = littlefoot()

  const activateDelay  = lf.get('activateDelay')
  const dismissDelay = lf.get('dismissDelay')

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

  const footnote1 = body.querySelector('[data-footnote-id="1"]')

  // these do nothing
  lf.activate()
  lf.activate('')

  // activate button
  lf.activate('[data-footnote-id="1"]')

  sleep(activateDelay)
    .then(() => {
      const content = body.querySelector('.littlefoot-footnote__content')

      t.equal(content.innerHTML, footnote1.getAttribute('data-littlefoot-footnote'),
        'injects content into popover')

      t.equal(body.querySelectorAll('button.is-active').length, 1,
        'activates one popover on activate()')

      lf.dismiss()
      return sleep(dismissDelay)
    })
    .then(() => {
      t.notOk(body.querySelector('button.is-active'), 'dismisses popovers on dismiss()')

      dispatchEvent(footnote1, 'click')

      t.equal(body.querySelectorAll('button.changing').length, 1, 'transitions popover activation on click')

      return sleep(activateDelay)
    })
    .then(() => {
      t.ok(body.querySelector('button.is-active'), 'activates one popover on button click event')

      dispatchEvent(body, 'click')
      return sleep(dismissDelay)
    })
    .then(() => {
      t.notOk(body.querySelector('button.is-active'), 'dismisses popovers on body click event')

      teardown()
      t.end()
    })
})
