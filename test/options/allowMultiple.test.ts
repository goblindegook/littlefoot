import { fireEvent } from '@testing-library/dom'
import {
  setDocumentBody,
  waitForChange,
  getAllActiveButtons,
  getButton
} from '../helper'
import littlefoot from '../../src'

beforeEach(() => {
  setDocumentBody('default.html')
})

afterEach(jest.useRealTimers)

test('disallow multiple activations', () => {
  jest.useFakeTimers()
  littlefoot({ allowMultiple: false })

  const one = getButton('1')
  fireEvent.click(one)
  jest.advanceTimersByTime(100)

  const two = getButton('2')
  fireEvent.click(two)
  jest.advanceTimersByTime(100)

  expect(getAllActiveButtons()).toEqual([two])
})

test('activate multiple footnotes on click', async () => {
  littlefoot({ activateDelay: 1, allowMultiple: true })

  const one = getButton('1')
  fireEvent.click(one)
  await waitForChange(one)

  const two = getButton('2')
  fireEvent.click(two)
  await waitForChange(two)

  expect(getAllActiveButtons()).toEqual([one, two])
})

test('activate multiple footnotes on hover', async () => {
  littlefoot({ activateDelay: 1, activateOnHover: true, allowMultiple: true })

  const one = getButton('1')
  fireEvent.mouseOver(one)
  await waitForChange(one)

  const two = getButton('2')
  fireEvent.mouseOver(two)
  await waitForChange(two)

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
  await waitForChange(b1)
  await waitForChange(b2)
  await waitForChange(b3)

  expect(getAllActiveButtons()).toEqual([b1, b2, b3])
})

test('dismiss multiple buttons when calling .dismiss()', async () => {
  const instance = littlefoot({
    activateDelay: 1,
    dismissDelay: 1,
    allowMultiple: true
  })

  const one = getButton('1')
  fireEvent.click(one)
  await waitForChange(one)

  const two = getButton('2')
  fireEvent.click(two)
  await waitForChange(two)

  instance.dismiss()

  await waitForChange(one)
  await waitForChange(two)

  expect(getAllActiveButtons()).toEqual([])
})

test('programmatic activation dismisses others when multiples are disallowed', async () => {
  const instance = littlefoot({
    activateDelay: 1,
    dismissDelay: 1,
    allowMultiple: false
  })

  const one = getButton('1')
  const two = getButton('2')

  instance.activate('1')
  await waitForChange(one)

  instance.activate('2')
  await waitForChange(two)

  expect(getAllActiveButtons()).toEqual([two])
})
