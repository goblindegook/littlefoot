interface ActionCallback<T> {
  (popover: T, button: T): void
}

export type UseCaseSettings<T> = Readonly<{
  activateCallback?: ActionCallback<T>
  activateDelay: number
  activateOnHover: boolean
  allowMultiple: boolean
  dismissCallback?: ActionCallback<T>
  dismissDelay: number
  dismissOnUnhover: boolean
  hoverDelay: number
}>

export type Footnote<T> = Readonly<{
  id: string
  activate: (onActivate?: ActionCallback<T>) => void
  destroy: () => void
  dismiss: (onDeactivate?: ActionCallback<T>) => void
  isActive: () => boolean
  isHovered: () => boolean
  isReady: () => boolean
  ready: () => void
  remove: () => void
  reposition: () => void
  resize: () => void
  startHovering: () => void
  stopHovering: () => void
}>

export type FootnoteAction = (id: string) => void
type DelayedFootnoteAction = (id: string, delay: number) => void

export type UseCases = Readonly<{
  activate: DelayedFootnoteAction
  dismiss: DelayedFootnoteAction
  dismissAll: () => void
  hover: FootnoteAction
  repositionAll: () => void
  resizeAll: () => void
  toggle: FootnoteAction
  unhover: FootnoteAction
  unmount: () => void
}>

export interface Adapter<T> {
  readonly footnotes: readonly Footnote<T>[]
  readonly unmount: () => void
}

export function createUseCases<T>(
  { footnotes, unmount }: Adapter<T>,
  settings: UseCaseSettings<T>
): UseCases {
  const dismiss = (delay: number) => (footnote: Footnote<T>) => {
    if (footnote.isReady()) {
      footnote.dismiss(settings.dismissCallback)
      setTimeout(footnote.remove, delay)
    }
  }

  const activate = (delay: number) => (footnote: Footnote<T>) => {
    if (!settings.allowMultiple) {
      footnotes
        .filter((current) => current.id !== footnote.id)
        .forEach(dismiss(settings.dismissDelay))
    }

    if (footnote.isReady()) {
      footnote.activate(settings.activateCallback)
      footnote.reposition()
      footnote.resize()
      setTimeout(footnote.ready, delay)
    }
  }

  const ifFound = (action: (footnote: Footnote<T>) => void) => (id: string) => {
    const footnote = footnotes.find((footnote) => footnote.id === id)
    if (footnote) {
      action(footnote)
    }
  }

  return {
    activate: (id, delay) => ifFound(activate(delay))(id),

    dismiss: (id, delay) => ifFound(dismiss(delay))(id),

    dismissAll: () => footnotes.forEach(dismiss(settings.dismissDelay)),

    repositionAll: () => footnotes.forEach((current) => current.reposition()),

    resizeAll: () => footnotes.forEach((current) => current.resize()),

    toggle: ifFound((footnote) =>
      footnote.isActive()
        ? dismiss(settings.dismissDelay)(footnote)
        : activate(settings.activateDelay)(footnote)
    ),

    hover: ifFound((footnote) => {
      footnote.startHovering()
      if (settings.activateOnHover && !footnote.isActive()) {
        activate(settings.hoverDelay)(footnote)
      }
    }),

    unhover: ifFound((footnote) => {
      footnote.stopHovering()
      if (settings.dismissOnUnhover) {
        setTimeout(
          () =>
            footnotes
              .filter((f) => !f.isHovered())
              .forEach(dismiss(settings.dismissDelay)),
          settings.hoverDelay
        )
      }
    }),

    unmount,
  }
}
