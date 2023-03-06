import { test, expect } from 'vitest'
import littlefoot from '../src/littlefoot'

test('allows getting default values', () => {
  const instance = littlefoot()
  expect(instance.getSetting('anchorParentSelector')).toBe('sup')
})

test('allows getting provided values', () => {
  const instance = littlefoot({ scope: 'main' })
  expect(instance.getSetting('scope')).toBe('main')
})

test('allows setting values', () => {
  const lf = littlefoot()
  lf.updateSetting('scope', 'article')
  expect(lf.getSetting('scope')).toBe('article')
})
