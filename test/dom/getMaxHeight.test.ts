import { getMaxHeight } from '../../src/adapter/dom'

function setup() {
  const fixture = document.createElement('div')
  document.body.appendChild(fixture)
  return fixture
}

test('getMaxHeight (none)', () => {
  const fixture = setup()
  fixture.style.maxHeight = 'none'
  expect(getMaxHeight(fixture)).toBe(fixture.clientHeight)
})

test.each([
  ['10em', '100%', 10],
  ['10em', '200%', 10],
  ['10em', '2em', 10],
  ['10rem', '100%', 10],
  ['10rem', '200%', 10],
  ['10rem', '2em', 10]
])('getMaxHeight (%s) with %s font size', (height, fontSize, expected) => {
  const fixture = setup()
  fixture.style.height = height
  fixture.style.maxHeight = height
  fixture.style.fontSize = fontSize

  expect(getMaxHeight(fixture)).toBe(expected) // FIXME: fixture.clientHeight
})

test.each([
  ['100cm', 100],
  ['100in', 100],
  ['100mm', 100],
  ['100pc', 100],
  ['100pt', 100],
  ['100px', 100],
  ['100vh', 100]
])('getMaxHeight (%s)', (height, expected) => {
  const fixture = setup()
  fixture.style.height = height
  fixture.style.maxHeight = height

  expect(getMaxHeight(fixture)).toBe(expected) // FIXME: fixture.clientHeight
})

test('getMaxHeight (%)', () => {
  const fixture = setup()
  fixture.style.height = '100%'
  fixture.style.maxHeight = '50%'

  expect(getMaxHeight(fixture)).toBe(fixture.clientHeight)
})
