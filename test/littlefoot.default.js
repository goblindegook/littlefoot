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

  const createDelay  = lf.get('popoverCreateDelay')
  const dismissDelay = lf.get('popoverDismissDelay')

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

  t.equal(body.querySelectorAll('.littlefoot-footnote__content').length, 0,
    'has no active footnotes')

  const firstFootnote = body.querySelectorAll('button')[0]

  lf.activate('[data-footnote-id="1"]')

  sleep(createDelay)
    .then(() => {
      const content = body.querySelector('.littlefoot-footnote__content')

      t.ok(content, 'activates one popover on activate()')

      t.equal(content.innerHTML, firstFootnote.getAttribute('data-littlefoot-footnote'),
        'has popover content matching stored content')

      lf.dismiss()

      return sleep(dismissDelay)
    })
    .then(() => {
      t.notOk(body.querySelector('.littlefoot-footnote__content'), 'dismisses popovers on dismiss()')

      dispatchEvent(firstFootnote, 'click')

      return sleep(createDelay)
    })
    .then(() => {
      const content = body.querySelector('.littlefoot-footnote__content')

      t.ok(content, 'activates one popover on click event')

      dispatchEvent(body, 'click')

      return sleep(dismissDelay)
    })
    .then(() => {
      t.notOk(body.querySelector('.littlefoot-footnote__content'),
        'dismisses popovers on click event')

      teardown()
      t.end()
    })
})
