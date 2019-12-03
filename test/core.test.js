import { createCore } from '../src/core'

afterEach(jest.useRealTimers)

test('footnote repositioning', () => {
  const one = { reposition: jest.fn() }
  const two = { reposition: jest.fn() }

  const adapter = {
    setup: () => [one, two],
    addListeners: () => null
  }

  const core = createCore(adapter, {})

  core.repositionAll()

  expect(one.reposition).toHaveBeenCalledTimes(1)
  expect(two.reposition).toHaveBeenCalledTimes(1)
})

test('footnote resizing', () => {
  const one = { resize: jest.fn() }
  const two = { resize: jest.fn() }

  const adapter = {
    setup: () => [one, two],
    addListeners: () => null
  }

  const core = createCore(adapter, {})

  core.resizeAll()

  expect(one.resize).toHaveBeenCalledTimes(1)
  expect(two.resize).toHaveBeenCalledTimes(1)
})

test('footnote activation on hover', () => {
  jest.useFakeTimers()

  const footnote = {
    startHovering: jest.fn(),
    isActive: () => false,
    isReady: () => true,
    activate: jest.fn(),
    reposition: jest.fn(),
    resize: jest.fn(),
    ready: jest.fn()
  }

  const adapter = {
    setup: () => [footnote],
    addListeners: () => null
  }

  const core = createCore(adapter, {
    activateOnHover: true,
    hoverDelay: 100,
    activateCallback: () => undefined
  })

  core.hover(footnote)

  expect(footnote.activate).toHaveBeenCalledTimes(1)
  expect(footnote.reposition).toHaveBeenCalledTimes(1)
  expect(footnote.resize).toHaveBeenCalledTimes(1)

  jest.advanceTimersByTime(100)

  expect(footnote.ready).toHaveBeenCalledTimes(1)
})

test('footnote dismissal on unhover', () => {
  jest.useFakeTimers()

  const footnote = {
    stopHovering: jest.fn(),
    isHovered: () => false,
    isReady: () => true,
    dismiss: jest.fn(),
    remove: jest.fn()
  }

  const adapter = {
    setup: () => [footnote],
    addListeners: () => null
  }

  const core = createCore(adapter, {
    dismissOnUnhover: true,
    hoverDelay: 50,
    dismissDelay: 100,
    activateCallback: () => undefined
  })

  core.unhover(footnote)

  jest.advanceTimersByTime(50)

  expect(footnote.dismiss).toHaveBeenCalledTimes(1)

  jest.advanceTimersByTime(100)

  expect(footnote.remove).toHaveBeenCalledTimes(1)
})

test('only unhovered footnotes are dismissed', () => {
  jest.useFakeTimers()

  const unhoveredFootnote = {
    stopHovering: jest.fn(),
    isHovered: () => false,
    isReady: () => true,
    dismiss: jest.fn(),
    remove: jest.fn()
  }

  const hoveredFootnote = {
    isHovered: () => true,
    isReady: () => true,
    dismiss: jest.fn(),
    remove: jest.fn()
  }

  const adapter = {
    setup: () => [unhoveredFootnote, hoveredFootnote],
    addListeners: () => null
  }

  const core = createCore(adapter, {
    dismissOnUnhover: true,
    hoverDelay: 50,
    dismissDelay: 100,
    activateCallback: () => undefined
  })

  core.unhover(unhoveredFootnote)

  jest.advanceTimersByTime(50)

  expect(unhoveredFootnote.dismiss).toHaveBeenCalledTimes(1)
  expect(hoveredFootnote.dismiss).toHaveBeenCalledTimes(0)

  jest.advanceTimersByTime(100)

  expect(unhoveredFootnote.remove).toHaveBeenCalledTimes(1)
  expect(hoveredFootnote.remove).toHaveBeenCalledTimes(0)
})
