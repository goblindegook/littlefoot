import test from 'tape'
import sinon from 'sinon'
import littlefoot from '../src/'
import { dispatchEvent } from '../src/events'
import setup from './helper/setup'
import teardown from './helper/teardown'
import sleep from './helper/sleep'

test('littlefoot setup with activateCallback', t => {
  setup('default.html')

  const body     = document.body
  const callback = sinon.spy()

  const lf = littlefoot({
    activateCallback: callback
  })

  const createDelay = lf.get('popoverCreateDelay')

  lf.activate('[data-footnote-id="1"]')

  sleep(createDelay)
    .then(() => {
      t.ok(callback.called, 'activateCallback called')

      teardown()
      t.end()
      return true
    })
})
