import test from 'tape'
import littlefoot from '../src/'

test('settings', (t) => {
  const lf = littlefoot()

  lf.updateSetting('test', 'boop')

  t.equal(lf.getSetting('test'), 'boop', 'allows getting and setting values')

  t.end()
})
