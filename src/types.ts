export type Footnote = {
  getId: () => string | null
  activate: (
    contentTemplate: string,
    className: string,
    onActivate: null | ((popover: HTMLElement, button: HTMLElement) => void)
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
  findAllFootnotes: (selector: string) => Footnote[]
  findFootnote: (Selection: string) => Footnote | null
  forAllActiveFootnotes: (fn: FootnoteAction, selector?: string) => Footnote[]
  forOtherActiveFootnotes: (
    fn: FootnoteAction,
    footnote: Footnote
  ) => Footnote[]
  hasHoveredFootnotes: () => boolean
}
