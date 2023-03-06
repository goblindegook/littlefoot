import { test, expect, afterEach, beforeEach, vi } from 'vitest'
import { fireEvent } from '@testing-library/dom'
import {
  setDocumentBody,
  waitToStopChanging,
  getAllActiveButtons,
  getButton,
} from '../helper'
import littlefoot from '../../src/littlefoot'

beforeEach(() => {
  setDocumentBody('default.html')
})

afterEach(() => {
  vi.useRealTimers()
})

test('disallow multiple activations', () => {
  vi.useFakeTimers()
  littlefoot({ allowMultiple: false })

  const one = getButton('1')
  fireEvent.click(one)
  vi.advanceTimersByTime(100)

  const two = getButton('2')
  fireEvent.click(two)
  vi.advanceTimersByTime(100)

  expect(getAllActiveButtons()).toEqual([two])
})

test('activate multiple footnotes on click', async () => {
  littlefoot({ activateDelay: 1, allowMultiple: true })

  const one = getButton('1')
  fireEvent.click(one)
  await waitToStopChanging(one)

  const two = getButton('2')
  fireEvent.click(two)
  await waitToStopChanging(two)

  expect(getAllActiveButtons()).toEqual([one, two])
})

test('activate multiple footnotes on hover', async () => {
  littlefoot({ activateDelay: 1, activateOnHover: true, allowMultiple: true })

  const one = getButton('1')
  fireEvent.mouseOver(one)
  await waitToStopChanging(one)

  const two = getButton('2')
  fireEvent.mouseOver(two)
  await waitToStopChanging(two)

  expect(getAllActiveButtons()).toEqual([one, two])
})

test('activate multiple buttons when calling .activate()', async () => {
  const instance = littlefoot({ activateDelay: 1, allowMultiple: true })

  const b1 = getButton('1')
  const b2 = getButton('2')
  const b3 = getButton('3')

  instance.activate('1')
  instance.activate('2')
  instance.activate('3')
  await waitToStopChanging(b1)
  await waitToStopChanging(b2)
  await waitToStopChanging(b3)

  expect(getAllActiveButtons()).toEqual([b1, b2, b3])
})

test('dismiss multiple buttons when calling .dismiss()', async () => {
  const instance = littlefoot({
    activateDelay: 1,
    dismissDelay: 1,
    allowMultiple: true,
  })

  const one = getButton('1')
  fireEvent.click(one)
  await waitToStopChanging(one)

  const two = getButton('2')
  fireEvent.click(two)
  await waitToStopChanging(two)

  instance.dismiss()

  await waitToStopChanging(one)
  await waitToStopChanging(two)

  expect(getAllActiveButtons()).toHaveLength(0)
})

test('programmatic activation dismisses others when multiples are disallowed', async () => {
  const instance = littlefoot({
    activateDelay: 1,
    dismissDelay: 1,
    allowMultiple: false,
  })

  const one = getButton('1')
  const two = getButton('2')

  instance.activate('1')
  await waitToStopChanging(one)

  instance.activate('2')
  await waitToStopChanging(two)

  expect(getAllActiveButtons()).toEqual([two])
})
