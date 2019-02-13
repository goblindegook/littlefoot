import test from 'tape'
import littlefoot from '../src/'

test('settings', t => {
  const lf = littlefoot()

  lf.updateSetting('scope', 'article')

  t.equal(lf.getSetting('scope'), 'article', 'allows getting and setting values')

  t.end()
})
