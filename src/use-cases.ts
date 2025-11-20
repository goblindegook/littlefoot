type ActionCallback<T> = (popover: T, button: T) => void

export type UseCaseSettings<T> = Readonly<{
  activateCallback?: ActionCallback<T>
  activateDelay: number
  activateOnHover: boolean
  allowMultiple: boolean
  dismissCallback?: ActionCallback<T>
  dismissDelay: number
  dismissOnUnhover: boolean
  dismissOnDocumentTouch: boolean
  hoverDelay: number
}>

export type Footnote<T> = Readonly<{
  id: string
  activate: (onActivate?: ActionCallback<T>) => void
  destroy: () => void
  dismiss: (onDeactivate?: ActionCallback<T>) => void
  isActive: () => boolean
  isReady: () => boolean
  ready: () => void
  remove: () => void
  reposition: () => void
  resize: () => void
}>

export type FootnoteAction = (id: string) => void
type DelayedFootnoteAction = (id: string, delay: number) => void

export type UseCases = Readonly<{
  activate: DelayedFootnoteAction
  dismiss: DelayedFootnoteAction
  dismissAll: () => void
  touchOutside: () => void
  hover: FootnoteAction
  repositionAll: () => void
  resizeAll: () => void
  toggle: FootnoteAction
  unhover: FootnoteAction
  unmount: () => void
}>

type MethodNames<T> = {
  [K in keyof T]: T[K] extends () => void ? K : never
}[keyof T]

export function createUseCases<T>(
  footnotes: readonly Footnote<T>[],
  reset: () => void,
  settings: UseCaseSettings<T>,
): UseCases {
  let hovered: string | null

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

  const withFootnote =
    (action: (footnote: Footnote<T>) => void) =>
    (id: string): void => {
      const footnote = footnotes.find((footnote) => footnote.id === id)
      if (footnote) {
        action(footnote)
      }
    }

  const dismissAll = () => footnotes.forEach(dismiss(settings.dismissDelay))

  const forEach = <T, M extends MethodNames<Footnote<T>>>(method: M) => {
    footnotes.forEach((footnote) => {
      footnote[method]()
    })
  }

  return {
    activate: (id, delay) => withFootnote(activate(delay))(id),

    dismiss: (id, delay) => withFootnote(dismiss(delay))(id),

    dismissAll,

    touchOutside: () => {
      if (settings.dismissOnDocumentTouch) {
        dismissAll()
      }
    },

    repositionAll: () => forEach('reposition'),

    resizeAll: () => forEach('resize'),

    toggle: withFootnote((footnote) =>
      footnote.isActive()
        ? dismiss(settings.dismissDelay)(footnote)
        : activate(settings.activateDelay)(footnote),
    ),

    hover: withFootnote((footnote) => {
      hovered = footnote.id
      if (settings.activateOnHover && !footnote.isActive()) {
        activate(settings.hoverDelay)(footnote)
      }
    }),

    unhover: withFootnote((footnote) => {
      if (footnote.id === hovered) {
        hovered = null
      }
      if (settings.dismissOnUnhover) {
        setTimeout(
          () => footnotes.filter((f) => f.id !== hovered).forEach(dismiss(settings.dismissDelay)),
          settings.hoverDelay,
        )
      }
    }),

    unmount: () => {
      forEach('destroy')
      reset()
    },
  }
}
