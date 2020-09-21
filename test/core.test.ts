import { createCore, Adapter, Footnote, CoreSettings } from '../src/core'

afterEach(jest.useRealTimers)

type Test = 'TEST'

function testSettings(
  overrides?: Partial<CoreSettings<Test>>
): CoreSettings<Test> {
  return {
    activateCallback: () => undefined,
    activateDelay: 0,
    activateOnHover: false,
    allowMultiple: false,
    dismissCallback: () => undefined,
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
  const one = testFootnote({ reposition: jest.fn() })
  const two = testFootnote({ reposition: jest.fn() })

  const adapter = testAdapter({
    footnotes: [one, two],
  })

  const core = createCore(
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

  core.repositionAll()

  expect(one.reposition).toHaveBeenCalledTimes(1)
  expect(two.reposition).toHaveBeenCalledTimes(1)
})

test('footnote resizing', () => {
  const one = testFootnote({ resize: jest.fn() })
  const two = testFootnote({ resize: jest.fn() })
  const adapter = testAdapter({ footnotes: [one, two] })
  const core = createCore(adapter, testSettings())

  core.resizeAll()

  expect(one.resize).toHaveBeenCalledTimes(1)
  expect(two.resize).toHaveBeenCalledTimes(1)
})

test('footnote activation on hover', () => {
  jest.useFakeTimers()

  const footnote = testFootnote({
    id: 'test-id',
    activate: jest.fn(),
    isActive: () => false,
    isReady: () => true,
    ready: jest.fn(),
    reposition: jest.fn(),
    resize: jest.fn(),
  })

  const adapter = testAdapter({ footnotes: [footnote] })

  const core = createCore(
    adapter,
    testSettings({
      activateCallback: () => undefined,
      activateOnHover: true,
      hoverDelay: 100,
    })
  )

  core.hover('test-id')

  expect(footnote.activate).toHaveBeenCalledTimes(1)
  expect(footnote.reposition).toHaveBeenCalledTimes(1)
  expect(footnote.resize).toHaveBeenCalledTimes(1)

  jest.advanceTimersByTime(100)

  expect(footnote.ready).toHaveBeenCalledTimes(1)
})

test('footnote dismissal on unhover', () => {
  jest.useFakeTimers()

  const footnote = testFootnote({
    id: 'test-id',
    dismiss: jest.fn(),
    isHovered: () => false,
    isReady: () => true,
    remove: jest.fn(),
  })

  const adapter = testAdapter({ footnotes: [footnote] })

  const core = createCore(
    adapter,
    testSettings({
      activateCallback: () => undefined,
      dismissDelay: 100,
      dismissOnUnhover: true,
      hoverDelay: 50,
    })
  )

  core.unhover('test-id')

  jest.advanceTimersByTime(50)

  expect(footnote.dismiss).toHaveBeenCalledTimes(1)

  jest.advanceTimersByTime(100)

  expect(footnote.remove).toHaveBeenCalledTimes(1)
})

test('only unhovered footnotes are dismissed', () => {
  jest.useFakeTimers()

  const unhoveredFootnote = testFootnote({
    id: 'unhovered-id',
    dismiss: jest.fn(),
    isHovered: () => false,
    isReady: () => true,
    remove: jest.fn(),
  })

  const hoveredFootnote = testFootnote({
    id: 'hovered-id',
    dismiss: jest.fn(),
    isHovered: () => true,
    isReady: () => true,
    remove: jest.fn(),
  })

  const adapter = testAdapter({
    footnotes: [unhoveredFootnote, hoveredFootnote],
  })

  const core = createCore(
    adapter,
    testSettings({
      activateCallback: () => undefined,
      dismissDelay: 100,
      dismissOnUnhover: true,
      hoverDelay: 50,
    })
  )

  core.unhover('unhovered-id')

  jest.advanceTimersByTime(50)

  expect(unhoveredFootnote.dismiss).toHaveBeenCalledTimes(1)
  expect(hoveredFootnote.dismiss).toHaveBeenCalledTimes(0)

  jest.advanceTimersByTime(100)

  expect(unhoveredFootnote.remove).toHaveBeenCalledTimes(1)
  expect(hoveredFootnote.remove).toHaveBeenCalledTimes(0)
})
