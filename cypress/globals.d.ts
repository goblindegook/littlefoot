declare namespace LittlefootTest {
  interface Window {
    littlefoot: any
  }
}

interface Window extends LittlefootTest.Window {}

declare var window: Window
