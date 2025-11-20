import { afterEach, expect, test, vi } from 'vitest'
import {
  createUseCases,
  type Footnote,
  type UseCaseSettings,
} from '../src/use-cases'

afterEach(() => {
  vi.useRealTimers()
})

type Test = 'TEST'

function testSettings(
  overrides?: Partial<UseCaseSettings<Test>>,
): UseCaseSettings<Test> {
  return {
    activateDelay: 0,
    activateOnHover: false,
    allowMultiple: false,
    dismissDelay: 0,
    dismissOnDocumentTouch: false,
    dismissOnUnhover: false,
    hoverDelay: 0,
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
    isReady: () => false,
    ready: () => undefined,
    remove: () => undefined,
    reposition: () => undefined,
    resize: () => undefined,
    ...overrides,
  }
}

test('footnote repositioning', () => {
  const one = testFootnote({ reposition: vi.fn() })
  const two = testFootnote({ reposition: vi.fn() })

  const { repositionAll } = createUseCases(
    [one, two],
    vi.fn(),
    testSettings({
      activateDelay: 100,
      activateOnHover: false,
      allowMultiple: false,
      dismissDelay: 100,
      dismissOnUnhover: false,
      hoverDelay: 250,
    }),
  )

  repositionAll()

  expect(one.reposition).toHaveBeenCalledTimes(1)
  expect(two.reposition).toHaveBeenCalledTimes(1)
})

test('footnote resizing', () => {
  const one = testFootnote({ resize: vi.fn() })
  const two = testFootnote({ resize: vi.fn() })
  const { resizeAll } = createUseCases([one, two], vi.fn(), testSettings())

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
  const { hover } = createUseCases(
    [footnote],
    vi.fn(),
    testSettings({
      activateCallback: () => undefined,
      activateOnHover: true,
      hoverDelay: 100,
    }),
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
    isReady: () => true,
    remove: vi.fn(),
  })
  const { unhover } = createUseCases(
    [footnote],
    vi.fn(),
    testSettings({
      activateCallback: () => undefined,
      dismissDelay: 100,
      dismissOnUnhover: true,
      hoverDelay: 50,
    }),
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
    isReady: () => true,
    remove: vi.fn(),
  })
  const hoveredFootnote = testFootnote({
    id: 'hovered-id',
    dismiss: vi.fn(),
    isReady: () => true,
    remove: vi.fn(),
  })
  const { hover, unhover } = createUseCases(
    [unhoveredFootnote, hoveredFootnote],
    vi.fn(),
    testSettings({
      activateCallback: () => undefined,
      dismissDelay: 100,
      dismissOnUnhover: true,
      hoverDelay: 50,
    }),
  )

  hover('hovered-id')
  unhover('unhovered-id')

  vi.advanceTimersByTime(50)
  expect(unhoveredFootnote.dismiss).toHaveBeenCalledTimes(1)
  expect(hoveredFootnote.dismiss).toHaveBeenCalledTimes(0)
  vi.advanceTimersByTime(100)
  expect(unhoveredFootnote.remove).toHaveBeenCalledTimes(1)
  expect(hoveredFootnote.remove).toHaveBeenCalledTimes(0)
})
