import { test, expect, afterEach, vi } from 'vitest'
import {
  createUseCases,
  Adapter,
  Footnote,
  UseCaseSettings,
} from '../src/use-cases'

afterEach(() => {
  vi.useRealTimers()
})

type Test = 'TEST'

function testSettings(
  overrides?: Partial<UseCaseSettings<Test>>
): UseCaseSettings<Test> {
  return {
    activateDelay: 0,
    activateOnHover: false,
    allowMultiple: false,
    dismissDelay: 0,
    dismissOnUnhover: false,
    hoverDelay: 0,
    ...overrides,
  }
}

function testAdapter(overrides?: Partial<Adapter<Test>>): Adapter<Test> {
  return {
    unmount: () => undefined,
    footnotes: [],
    ...overrides,
  }
}

function testFootnote(overrides: Partial<Footnote<Test>> = {}): Footnote<Test> {
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
  const one = testFootnote({ reposition: vi.fn() })
  const two = testFootnote({ reposition: vi.fn() })

  const adapter = testAdapter({
    footnotes: [one, two],
  })

  const { repositionAll } = createUseCases(
    adapter,
    testSettings({
      activateDelay: 100,
      activateOnHover: false,
      allowMultiple: false,
      dismissDelay: 100,
      dismissOnUnhover: false,
      hoverDelay: 250,
    })
  )

  repositionAll()

  expect(one.reposition).toHaveBeenCalledTimes(1)
  expect(two.reposition).toHaveBeenCalledTimes(1)
})

test('footnote resizing', () => {
  const one = testFootnote({ resize: vi.fn() })
  const two = testFootnote({ resize: vi.fn() })
  const adapter = testAdapter({ footnotes: [one, two] })
  const { resizeAll } = createUseCases(adapter, testSettings())

  resizeAll()

  expect(one.resize).toHaveBeenCalledTimes(1)
  expect(two.resize).toHaveBeenCalledTimes(1)
})

test('footnote activation on hover', () => {
  vi.useFakeTimers()
  const footnote = testFootnote({
    id: 'test-id',
    activate: vi.fn(),
    isActive: () => false,
    isReady: () => true,
    ready: vi.fn(),
    reposition: vi.fn(),
    resize: vi.fn(),
  })
  const adapter = testAdapter({ footnotes: [footnote] })
  const { hover } = createUseCases(
    adapter,
    testSettings({
      activateCallback: () => undefined,
      activateOnHover: true,
      hoverDelay: 100,
    })
  )

  hover('test-id')

  expect(footnote.activate).toHaveBeenCalledTimes(1)
  expect(footnote.reposition).toHaveBeenCalledTimes(1)
  expect(footnote.resize).toHaveBeenCalledTimes(1)
  vi.advanceTimersByTime(100)
  expect(footnote.ready).toHaveBeenCalledTimes(1)
})

test('footnote dismissal on unhover', () => {
  vi.useFakeTimers()
  const footnote = testFootnote({
    id: 'test-id',
    dismiss: vi.fn(),
    isHovered: () => false,
    isReady: () => true,
    remove: vi.fn(),
  })
  const adapter = testAdapter({ footnotes: [footnote] })
  const { unhover } = createUseCases(
    adapter,
    testSettings({
      activateCallback: () => undefined,
      dismissDelay: 100,
      dismissOnUnhover: true,
      hoverDelay: 50,
    })
  )

  unhover('test-id')

  vi.advanceTimersByTime(50)
  expect(footnote.dismiss).toHaveBeenCalledTimes(1)
  vi.advanceTimersByTime(100)
  expect(footnote.remove).toHaveBeenCalledTimes(1)
})

test('only unhovered footnotes are dismissed', () => {
  vi.useFakeTimers()
  const unhoveredFootnote = testFootnote({
    id: 'unhovered-id',
    dismiss: vi.fn(),
    isHovered: () => false,
    isReady: () => true,
    remove: vi.fn(),
  })
  const hoveredFootnote = testFootnote({
    id: 'hovered-id',
    dismiss: vi.fn(),
    isHovered: () => true,
    isReady: () => true,
    remove: vi.fn(),
  })
  const adapter = testAdapter({
    footnotes: [unhoveredFootnote, hoveredFootnote],
  })
  const { unhover } = createUseCases(
    adapter,
    testSettings({
      activateCallback: () => undefined,
      dismissDelay: 100,
      dismissOnUnhover: true,
      hoverDelay: 50,
    })
  )

  unhover('unhovered-id')

  vi.advanceTimersByTime(50)
  expect(unhoveredFootnote.dismiss).toHaveBeenCalledTimes(1)
  expect(hoveredFootnote.dismiss).toHaveBeenCalledTimes(0)
  vi.advanceTimersByTime(100)
  expect(unhoveredFootnote.remove).toHaveBeenCalledTimes(1)
  expect(hoveredFootnote.remove).toHaveBeenCalledTimes(0)
})
