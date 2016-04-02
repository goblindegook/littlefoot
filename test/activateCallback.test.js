import 'core-js/es6/promise'
import delay from 'core-js/library/core/delay'
import test from 'tape'
import sinon from 'sinon'
import { setup, teardown } from './helper'
import littlefoot from '../src/'

test('littlefoot setup with activateCallback', (t) => {
  setup('default.html')

  const callback = sinon.spy()

  const lf = littlefoot({ activateCallback: callback })

  const activateDelay = lf.get('activateDelay')

  lf.activate('button[data-footnote-id="1"]')

  delay(activateDelay)
    .then(() => {
      t.ok(callback.called, 'activateCallback called')

      teardown()
      t.end()
    })
})
