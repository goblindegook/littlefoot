import test from 'tape'
import littlefoot from '../src/'
import { dispatchEvent } from '../src/events'
import setup from './helper/setup'
import teardown from './helper/teardown'
import sleep from './helper/sleep'

test('littlefoot setup with allowMultiple=true', t => {
  setup('default.html')

  const lf = littlefoot({ allowMultiple: true })

  const activateDelay  = lf.get('activateDelay')
  const dismissDelay = lf.get('dismissDelay')
  const buttons      = document.querySelectorAll('[data-footnote-id]')

  dispatchEvent(document.body.querySelector('[data-footnote-id="1"]'), 'click')
  dispatchEvent(document.body.querySelector('[data-footnote-id="2"]'), 'click')

  sleep(activateDelay)
    .then(() => {
      t.equal(document.body.querySelectorAll('button.is-active').length, 2,
        'allows multiple active popovers')

      lf.dismiss()
      return sleep(dismissDelay)
    })
    .then(() => {
      t.equal(document.body.querySelectorAll('button.is-active').length, 0,
        'dismisses all popovers on dismiss()')

      lf.activate('[data-footnote-id]')
      return sleep(activateDelay)
    })
    .then(() => {
      t.equal(document.body.querySelectorAll('button.is-active').length, buttons.length,
        'activate all popovers with activate()')

      teardown()
      t.end()
    })
})

test('littlefoot setup with allowMultiple=false', t => {
  setup('default.html')

  const lf = littlefoot({
    allowMultiple: false
  })

  const activateDelay = lf.get('activateDelay')

  dispatchEvent(document.body.querySelector('[data-footnote-id="1"]'), 'click')

  sleep(activateDelay)
    .then(() => {
      dispatchEvent(document.body.querySelector('[data-footnote-id="2"]'), 'click')
      return sleep(activateDelay)
    })
    .then(() => {
      t.equal(document.body.querySelectorAll('button.is-active').length, 1,
        'does not allow multiple active popovers')

      teardown()
      t.end()
    })
})
