import { fireEvent } from 'dom-testing-library'
import littlefoot from '../../src'
import {
  setDocumentBody,
  getButton,
  waitForTransition,
  getAllActiveButtons
} from '../helper'

beforeEach(() => {
  setDocumentBody('default.html')
})

// FIXME: document appears to be polluted, tests aren't isolated
xtest('disallow multiple activations', async () => {
  littlefoot({ activateDelay: 1, allowMultiple: false })

  const one = getButton('1')
  fireEvent.click(one)
  await waitForTransition(one)

  const two = getButton('2')
  fireEvent.click(two)
  await waitForTransition(two)

  expect(getAllActiveButtons()).toHaveLength(1)
})

test('activate multiple footnotes on click', async () => {
  littlefoot({ activateDelay: 1, allowMultiple: true })

  const one = getButton('1')
  fireEvent.click(one)
  await waitForTransition(one)

  const two = getButton('2')
  fireEvent.click(two)
  await waitForTransition(two)

  expect(getAllActiveButtons()).toHaveLength(2)
})

test('activate multiple footnotes on hover', async () => {
  littlefoot({ activateDelay: 1, activateOnHover: true, allowMultiple: true })

  const one = getButton('1')
  fireEvent.mouseOver(one)
  await waitForTransition(one)

  const two = getButton('2')
  fireEvent.mouseOver(two)
  await waitForTransition(two)

  expect(getAllActiveButtons()).toHaveLength(2)
})

test('activate multiple buttons when calling .activate()', async () => {
  const instance = littlefoot({ activateDelay: 1, allowMultiple: true })

  instance.activate('button[data-footnote-id]')
  await waitForTransition(getButton('1'))
  await waitForTransition(getButton('2'))
  await waitForTransition(getButton('3'))
  await waitForTransition(getButton('4'))

  expect(getAllActiveButtons()).toHaveLength(4)
})

test('dismiss multiple buttons when calling .dismiss()', async () => {
  const instance = littlefoot({
    activateDelay: 1,
    dismissDelay: 1,
    allowMultiple: true
  })

  const one = getButton('1')
  fireEvent.click(one)
  await waitForTransition(one)

  const two = getButton('2')
  fireEvent.click(two)
  await waitForTransition(two)

  instance.dismiss()

  await waitForTransition(one)
  await waitForTransition(two)

  expect(getAllActiveButtons()).toHaveLength(0)
})
