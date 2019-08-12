export type Settings = Readonly<{
  activateCallback?: (popover: HTMLElement, button: HTMLElement) => void
  activateDelay: number
  activateOnHover: boolean
  allowDuplicates: boolean
  allowMultiple: boolean
  anchorParentSelector: string
  anchorPattern: RegExp
  buttonTemplate: string
  contentTemplate: string
  dismissDelay: number
  dismissOnUnhover: boolean
  footnoteSelector: string
  hoverDelay: number
  numberResetSelector?: string
  scope?: string
}>

export type Footnote = Readonly<{
  id: string
  activate: (
    onActivate?: (popover: HTMLElement, button: HTMLElement) => void
  ) => void
  dismiss: () => void
  isActive: () => boolean
  isChanging: () => boolean
  isHovered: () => boolean
  ready: () => void
  remove: () => void
  reposition: () => void
  resize: () => void
  startChanging: () => void
  stopChanging: () => void
  startHovering: () => void
  stopHovering: () => void
  unmount: () => void
}>
