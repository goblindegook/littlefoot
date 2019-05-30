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

test('disallow multiple activations', async () => {
  littlefoot({ activateDelay: 1, allowMultiple: false })

  const one = getButton('1')
  fireEvent.click(one)
  await waitForChange(one)

  const two = getButton('2')
  fireEvent.click(two)
  await waitForChange(two)

  expect(getAllActiveButtons()).toHaveLength(1)
})

test('activate multiple footnotes on click', async () => {
  littlefoot({ activateDelay: 1, allowMultiple: true })

  const one = getButton('1')
  fireEvent.click(one)
  await waitForChange(one)

  const two = getButton('2')
  fireEvent.click(two)
  await waitForChange(two)

  expect(getAllActiveButtons()).toHaveLength(2)
})

test('activate multiple footnotes on hover', async () => {
  littlefoot({ activateDelay: 1, activateOnHover: true, allowMultiple: true })

  const one = getButton('1')
  fireEvent.mouseOver(one)
  await waitForChange(one)

  const two = getButton('2')
  fireEvent.mouseOver(two)
  await waitForChange(two)

  expect(getAllActiveButtons()).toHaveLength(2)
})

test('activate multiple buttons when calling .activate()', async () => {
  const instance = littlefoot({ activateDelay: 1, allowMultiple: true })

  instance.activate('1')
  instance.activate('2')
  instance.activate('3')
  await waitForChange(getButton('1'))
  await waitForChange(getButton('2'))
  await waitForChange(getButton('3'))

  expect(getAllActiveButtons()).toHaveLength(3)
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

  expect(getAllActiveButtons()).toHaveLength(0)
})
