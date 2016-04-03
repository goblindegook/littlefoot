import test from 'tape'
import simulant from 'simulant'
import littlefoot from '../src/'
import { setup, sleep, teardown } from './helper'

test('keyboard event handling', (t) => {
  setup('default.html')

  const body = document.body

  const lf = littlefoot()

  const activateDelay  = lf.getSetting('activateDelay')
  const dismissDelay = lf.getSetting('dismissDelay')

  lf.activate('button[data-footnote-id="1"]')

  sleep(activateDelay)
    .then(() => {
      t.ok(body.querySelector('.littlefoot-footnote__content'), 'has active popover before escape keypress')

      simulant.fire(document, 'keyup', { keyCode: 13 }) // enter

      t.ok(body.querySelector('.littlefoot-footnote__content'), 'has active popover unless escape keypress')

      simulant.fire(document, 'keyup', { keyCode: 27 }) // esc

      return sleep(dismissDelay)
    })
    .then(() => {
      t.notOk(body.querySelector('.littlefoot-footnote__content'), 'dismisses popovers on escape keypress')

      teardown()
      t.end()
    })
})
