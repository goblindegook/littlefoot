import littlefoot from '../src'

test('allows getting default values', () => {
  const instance = littlefoot()
  expect(instance.getSetting('anchorParentSelector')).toBe('sup')
})

test('allows getting provided values', () => {
  const instance = littlefoot({ footnoteSelector: 'main li' })
  expect(instance.getSetting('footnoteSelector')).toBe('main li')
})

test('allows setting values', () => {
  const lf = littlefoot()
  lf.updateSetting('footnoteSelector', 'article li')
  expect(lf.getSetting('footnoteSelector')).toBe('article li')
})
