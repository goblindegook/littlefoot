import test from 'tape'
import littlefoot from '../src/'
import { setup, sleep, teardown, keyup, KEY_ENTER, KEY_ESCAPE } from './helper'

test('keyboard event handling', async t => {
  setup('default')

  const body = document.body

  const lf = littlefoot()
  const activateDelay = lf.getSetting('activateDelay')
  const dismissDelay = lf.getSetting('dismissDelay')

  lf.activate('button[data-footnote-id="1"]')

  await sleep(activateDelay)

  t.ok(
    body.querySelector('.littlefoot-footnote__content'),
    'has active popover before escape keypress'
  )

  keyup(document, KEY_ENTER)

  t.ok(
    body.querySelector('.littlefoot-footnote__content'),
    'has active popover unless escape keypress'
  )

  keyup(document, KEY_ESCAPE)

  await sleep(dismissDelay)

  t.notOk(
    body.querySelector('.littlefoot-footnote__content'),
    'dismisses popovers on escape keypress'
  )

  teardown()
  t.end()
})
