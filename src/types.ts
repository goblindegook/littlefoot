export type TemplateData = {
  content: string
  id: string
  number: number
  reference: string
}

export type Footnote = {
  getId: () => string
  activate: (
    contentTemplate: string,
    onActivate?: (popover: HTMLElement, button: HTMLElement) => void
  ) => void
  dismiss: () => void
  hover: () => void
  isActive: () => boolean
  isChanging: () => boolean
  ready: () => void
  remove: () => void
  reposition: () => void
  resize: () => void
  startChanging: () => void
  stopChanging: () => void
}

type FootnoteCallback = (current: Footnote) => void

export type Adapter = {
  findFootnote: (id: string) => Footnote | null
  forEachFootnote: (callback: FootnoteCallback, selector?: string) => void
  forEachFootnoteExcept: (callback: FootnoteCallback, id: string) => void
  hasHoveredFootnotes: () => boolean
}
