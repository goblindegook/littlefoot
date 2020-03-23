import { createCore, Adapter, Footnote } from '../src/core'
import { DEFAULT_SETTINGS } from '../src/settings'

afterEach(jest.useRealTimers)

function createAdapter(overrides = {}): Adapter {
  return {
    addListeners: () => () => {
      /* noop */
    },
    cleanup: () => {
      /* noop */
    },
    setup: () => [],
    ...overrides,
  }
}

function createFootnote(overrides: Partial<Footnote> = {}): Footnote {
  return {
    id: 'id',
    activate: () => undefined,
    destroy: () => undefined,
    dismiss: () => undefined,
    isActive: () => false,
    isHovered: () => false,
    isReady: () => false,
    ready: () => undefined,
    remove: () => undefined,
    reposition: () => undefined,
    resize: () => undefined,
    startHovering: () => undefined,
    stopHovering: () => undefined,
    ...overrides,
  }
}

test('footnote repositioning', () => {
  const one = { reposition: jest.fn() }
  const two = { reposition: jest.fn() }

  const adapter = createAdapter({
    setup: () => [one, two],
  })

  const core = createCore(adapter, DEFAULT_SETTINGS)

  core.repositionAll()

  expect(one.reposition).toHaveBeenCalledTimes(1)
  expect(two.reposition).toHaveBeenCalledTimes(1)
})

test('footnote resizing', () => {
  const one = { resize: jest.fn() }
  const two = { resize: jest.fn() }

  const adapter = createAdapter({
    setup: () => [one, two],
  })

  const core = createCore(adapter, DEFAULT_SETTINGS)

  core.resizeAll()

  expect(one.resize).toHaveBeenCalledTimes(1)
  expect(two.resize).toHaveBeenCalledTimes(1)
})

test('footnote activation on hover', () => {
  jest.useFakeTimers()

  const footnote = createFootnote({
    activate: jest.fn(),
    isActive: () => false,
    isReady: () => true,
    ready: jest.fn(),
    reposition: jest.fn(),
    resize: jest.fn(),
  })

  const adapter = createAdapter({
    setup: () => [footnote],
  })

  const core = createCore(adapter, {
    ...DEFAULT_SETTINGS,
    activateCallback: () => undefined,
    activateOnHover: true,
    hoverDelay: 100,
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

  const footnote = createFootnote({
    dismiss: jest.fn(),
    isHovered: () => false,
    isReady: () => true,
    remove: jest.fn(),
  })

  const adapter = createAdapter({
    setup: () => [footnote],
  })

  const core = createCore(adapter, {
    ...DEFAULT_SETTINGS,
    activateCallback: () => undefined,
    dismissDelay: 100,
    dismissOnUnhover: true,
    hoverDelay: 50,
  })

  core.unhover(footnote)

  jest.advanceTimersByTime(50)

  expect(footnote.dismiss).toHaveBeenCalledTimes(1)

  jest.advanceTimersByTime(100)

  expect(footnote.remove).toHaveBeenCalledTimes(1)
})

test('only unhovered footnotes are dismissed', () => {
  jest.useFakeTimers()

  const unhoveredFootnote = createFootnote({
    dismiss: jest.fn(),
    isHovered: () => false,
    isReady: () => true,
    remove: jest.fn(),
  })

  const hoveredFootnote = createFootnote({
    dismiss: jest.fn(),
    isHovered: () => true,
    isReady: () => true,
    remove: jest.fn(),
  })

  const adapter = createAdapter({
    setup: () => [unhoveredFootnote, hoveredFootnote],
  })

  const core = createCore(adapter, {
    ...DEFAULT_SETTINGS,
    activateCallback: () => undefined,
    dismissDelay: 100,
    dismissOnUnhover: true,
    hoverDelay: 50,
  })

  core.unhover(unhoveredFootnote)

  jest.advanceTimersByTime(50)

  expect(unhoveredFootnote.dismiss).toHaveBeenCalledTimes(1)
  expect(hoveredFootnote.dismiss).toHaveBeenCalledTimes(0)

  jest.advanceTimersByTime(100)

  expect(unhoveredFootnote.remove).toHaveBeenCalledTimes(1)
  expect(hoveredFootnote.remove).toHaveBeenCalledTimes(0)
})
