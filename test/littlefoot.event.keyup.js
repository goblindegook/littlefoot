import test from 'tape'
import littlefoot from '../src/'
import { dispatchEvent } from '../src/events'
import setup from './helper/setup'
import teardown from './helper/teardown'
import sleep from './helper/sleep'

test('keyboard event handling', t => {
  setup('default.html')

  const body = document.body

  const lf = littlefoot()

  const createDelay  = lf.get('popoverCreateDelay')
  const dismissDelay = lf.get('popoverDismissDelay')

  lf.activate('[data-footnote-id="1"]')

  sleep(createDelay)
    .then(() => {
      const keyboardEvent = document.createEvent('Event')

      t.ok(body.querySelector('.littlefoot-footnote__content'), 'has active popover before escape keypress')

      keyboardEvent.keyCode = 13 // enter
      keyboardEvent.initEvent('keyup')
      document.dispatchEvent(keyboardEvent)

      t.ok(body.querySelector('.littlefoot-footnote__content'), 'has active popover unless escape keypress')

      keyboardEvent.keyCode = 27 // escape
      keyboardEvent.initEvent('keyup')
      document.dispatchEvent(keyboardEvent)

      return sleep(dismissDelay)
    })
    .then(() => {
      t.notOk(body.querySelector('.littlefoot-footnote__content'), 'dismisses popovers on escape keypress')

      teardown()
      t.end()
    })
})
