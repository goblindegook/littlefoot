import 'core-js/es6/promise'
import delay from 'core-js/library/core/delay'
import test from 'tape'
import littlefoot from '../src/'
import { dispatchEvent } from '../src/dom/events'
import { setup, teardown } from './helper'

test('littlefoot setup with allowMultiple=true', (t) => {
  setup('default.html')

  const lf = littlefoot({ allowMultiple: true })

  const activateDelay  = lf.get('activateDelay')
  const dismissDelay = lf.get('dismissDelay')
  const buttons      = document.querySelectorAll('button[data-footnote-id]')

  dispatchEvent(document.body.querySelector('button[data-footnote-id="1"]'), 'click')
  dispatchEvent(document.body.querySelector('button[data-footnote-id="2"]'), 'click')

  delay(activateDelay)
    .then(() => {
      t.equal(document.body.querySelectorAll('button.is-active').length, 2,
        'allows multiple active popovers')

      lf.dismiss()
      return delay(dismissDelay)
    })
    .then(() => {
      t.equal(document.body.querySelectorAll('button.is-active').length, 0,
        'dismisses all popovers on dismiss()')

      lf.activate('button[data-footnote-id]')
      return delay(activateDelay)
    })
    .then(() => {
      t.equal(document.body.querySelectorAll('button.is-active').length, buttons.length,
        'activate all popovers with activate()')

      teardown()
      t.end()
    })
})

test('littlefoot setup with allowMultiple=false', (t) => {
  setup('default.html')

  const lf = littlefoot({ allowMultiple: false })

  const activateDelay = lf.get('activateDelay')

  dispatchEvent(document.body.querySelector('button[data-footnote-id="1"]'), 'click')

  delay(activateDelay)
    .then(() => {
      dispatchEvent(document.body.querySelector('button[data-footnote-id="2"]'), 'click')
      return delay(activateDelay)
    })
    .then(() => {
      t.equal(document.body.querySelectorAll('button.is-active').length, 1,
        'does not allow multiple active popovers')

      teardown()
      t.end()
    })
})
