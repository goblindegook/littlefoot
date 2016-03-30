import test from 'tape'
import littlefoot from '../src/'
import setup from './helper/setup'
import teardown from './helper/teardown'
import sleep from './helper/sleep'
import { createKeyboardEvent } from './helper/events'

test('keyboard event handling', t => {
  setup('default.html')

  const body = document.body

  const lf = littlefoot()

  const createDelay  = lf.get('popoverCreateDelay')
  const dismissDelay = lf.get('popoverDismissDelay')

  lf.activate('[data-footnote-id="1"]')

  sleep(createDelay)
    .then(() => {
      const enterKeyboardEvent  = createKeyboardEvent('keyup', 13) // Enter
      const escapeKeyboardEvent = createKeyboardEvent('keyup', 27) // Escape

      t.ok(body.querySelector('.littlefoot-footnote__content'), 'has active popover before escape keypress')

      document.dispatchEvent(enterKeyboardEvent)

      t.ok(body.querySelector('.littlefoot-footnote__content'), 'has active popover unless escape keypress')

      document.dispatchEvent(escapeKeyboardEvent)

      return sleep(dismissDelay)
    })
    .then(() => {
      t.notOk(body.querySelector('.littlefoot-footnote__content'), 'dismisses popovers on escape keypress')

      teardown()
      t.end()
    })
})
