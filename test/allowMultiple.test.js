import test from 'tape'
import littlefoot from '../src/'
import simulant from 'simulant'
import { setup, sleep, teardown } from './helper'

test('setup with allowMultiple=true', async (t) => {
  setup('default.html')

  const lf = littlefoot({ allowMultiple: true })

  const activateDelay = lf.getSetting('activateDelay')
  const dismissDelay = lf.getSetting('dismissDelay')
  const buttons = document.querySelectorAll('button[data-footnote-id]')

  simulant.fire(document.body.querySelector('button[data-footnote-id="1"]'), 'click')
  simulant.fire(document.body.querySelector('button[data-footnote-id="2"]'), 'click')

  await sleep(activateDelay)

  t.equal(document.body.querySelectorAll('button.is-active').length, 2,
    'allows multiple active popovers')

  lf.dismiss()
  await sleep(dismissDelay)

  t.equal(document.body.querySelectorAll('button.is-active').length, 0,
    'dismisses all popovers on dismiss()')

  lf.activate('button[data-footnote-id]')
  await sleep(activateDelay)

  t.equal(document.body.querySelectorAll('button.is-active').length, buttons.length,
    'activate all popovers with activate()')

  teardown()
  t.end()
})

test('setup with allowMultiple=false', async (t) => {
  setup('default.html')

  const lf = littlefoot({ allowMultiple: false })

  const activateDelay = lf.getSetting('activateDelay')

  simulant.fire(document.body.querySelector('button[data-footnote-id="1"]'), 'click')

  await sleep(activateDelay)

  simulant.fire(document.body.querySelector('button[data-footnote-id="2"]'), 'click')

  await sleep(activateDelay)

  t.equal(document.body.querySelectorAll('button.is-active').length, 1,
    'does not allow multiple active popovers')

  teardown()
  t.end()
})
