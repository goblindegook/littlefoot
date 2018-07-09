import test from 'tape'
import sinon from 'sinon'
import { setup, teardown } from './helper'
import littlefoot from '../src/'

test('setup with activateCallback', t => {
  setup('default.html')
  const activateCallback = sinon.spy()
  const lf = littlefoot({ activateDelay: 0, activateCallback })

  lf.activate('button[data-footnote-id="1"]')
  t.ok(activateCallback.called, 'activateCallback called')

  teardown()
  t.end()
})
