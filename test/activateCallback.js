import test from 'tape'
import sinon from 'sinon'
import littlefoot from '../src/'
import setup from './helper/setup'
import teardown from './helper/teardown'
import sleep from './helper/sleep'

test('littlefoot setup with activateCallback', (t) => {
  setup('default.html')

  const callback = sinon.spy()

  const lf = littlefoot({ activateCallback: callback })

  const activateDelay = lf.get('activateDelay')

  lf.activate('[data-footnote-id="1"]')

  sleep(activateDelay)
    .then(() => {
      t.ok(callback.called, 'activateCallback called')

      teardown()
      t.end()
    })
})
