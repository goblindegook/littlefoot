export type TemplateData = {
  content: string
  id: number
  number: number
  reference: string
}

export type Footnote = {
  getId: () => string | null
  activate: (
    contentTemplate: string,
    onActivate?: (popover: HTMLElement, button: HTMLElement) => void
  ) => Footnote
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

export type FootnoteAction = (footnote: Footnote) => void

export type Adapter = {
  findFootnotes: (selector: string) => Footnote[]
  forAllActiveFootnotes: (fn: FootnoteAction, selector?: string) => Footnote[]
  forOtherActiveFootnotes: (
    fn: FootnoteAction,
    footnote: Footnote
  ) => Footnote[]
  hasHoveredFootnotes: () => boolean
}
