import littlefoot from '../src'

test('allows getting values', () => {
  const lf = littlefoot()
  expect(lf.getSetting('anchorParentSelector')).toEqual('sup')
})

test('allows setting values', () => {
  const lf = littlefoot()
  lf.updateSetting('scope', 'article')
  expect(lf.getSetting('scope')).toEqual('article')
})
