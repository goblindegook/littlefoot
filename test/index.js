import test from 'tape'
import escape from 'lodash/escape'
import littlefoot from '../src/'
import { dispatchEvent } from '../src/events'

const fs = require('fs')

/**
 * Setup fixtures.
 */
function setup() {
  const content = document.createElement('div')
  content.innerHTML = fs.readFileSync(__dirname + '/fixtures/content.html', 'utf8')
  document.body.appendChild(content)
}

/**
 * Tear down fixtures.
 */
function teardown() {
  Array.prototype.forEach.call(document.body.children, child => {
    document.body.removeChild(child)
  })
}

test('littlefoot setup with default options', t => {
  t.plan(11)

  setup()

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

  dispatchEvent(firstFootnote, 'click')

  setTimeout(() => {
    const content = body.querySelector('.littlefoot-footnote__content')

    t.ok(content, 'has one active popover on activating the footnote')

    t.equal(content.innerHTML, firstFootnote.getAttribute('data-littlefoot-footnote'),
      'has the popover content matching stored content')

    dispatchEvent(body, 'click')

    setTimeout(() => {
      t.notOk(body.querySelector('.littlefoot-footnote__content'),
        'dismisses footnote when clicking outside the popover')

      teardown()

    }, dismissDelay)

  }, createDelay)
})
