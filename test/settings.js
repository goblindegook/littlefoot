import test from 'tape'
import sinon from 'sinon'
import littlefoot from '../src/'
import { dispatchEvent } from '../src/events'
import setup from './helper/setup'
import teardown from './helper/teardown'
import sleep from './helper/sleep'

test('littlefoot settings', t => {
  const lf = littlefoot()

  lf.set('test', 'boop')

  t.equal(lf.get('test'), 'boop', 'allows getting and setting values')

  t.end()
})
