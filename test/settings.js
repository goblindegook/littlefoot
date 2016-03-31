import test from 'tape'
import littlefoot from '../src/'

test('littlefoot settings', t => {
  const lf = littlefoot()

  lf.set('test', 'boop')

  t.equal(lf.get('test'), 'boop', 'allows getting and setting values')

  t.end()
})
