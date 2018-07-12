import template from 'lodash.template'

function createActivate (adapter, settings) {
  return (footnote, className) => {
    const { activateCallback, activateDelay, contentTemplate } = settings
    const render = template(contentTemplate)

    if (!footnote.isChanging()) {
      footnote.startChanging()

      const activated = footnote.activate(render, className, activateCallback)

      adapter.findActiveFootnotes().forEach(fn => {
        fn.reposition()
        fn.resize()
      })

      setTimeout(() => {
        // FIXME: reposition and resize here?
        activated.ready()
        activated.stopChanging()
      }, activateDelay)
    }
  }
}

function createDismiss (settings) {
  return (footnote, delay = settings.dismissDelay) => {
    if (!footnote.isChanging()) {
      footnote.startChanging()
      footnote.dismiss()

      setTimeout(() => {
        footnote.remove()
        footnote.stopChanging()
      }, delay)
    }
  }
}

export function createCore (adapter, settings) {
  const activate = createActivate(adapter, settings)
  const dismiss = createDismiss(settings)

  const activateSingle = (footnote, allowMultiple) => {
    if (!allowMultiple) {
      adapter.findOtherActiveFootnotes(footnote).forEach(dismiss)
    }
    activate(footnote)
  }

  return {
    activate,

    dismiss (selector, delay) {
      adapter.findActiveFootnotes(selector)
        .forEach(footnote => dismiss(footnote, delay))
    },

    reposition () {
      adapter.findActiveFootnotes()
        .forEach(footnote => footnote.reposition())
    },

    resize () {
      adapter.findActiveFootnotes()
        .forEach(footnote => footnote.resize())
    },

    toggle (footnote, popover) {
      const { allowMultiple } = settings
      if (footnote) {
        footnote.blur()

        if (footnote.isActive()) {
          dismiss(footnote)
        } else {
          activateSingle(footnote, allowMultiple)
        }
      } else if (!popover) {
        adapter.findActiveFootnotes().forEach(dismiss)
      }
    },

    hover (footnote) {
      const { activateOnHover, allowMultiple } = settings
      if (activateOnHover && !footnote.isActive()) {
        footnote.hover()
        activateSingle(footnote, allowMultiple)
      }
    },

    unhover () {
      const { dismissOnUnhover, hoverDelay } = settings
      if (dismissOnUnhover) {
        setTimeout(() => {
          if (!adapter.hasHoveredFootnotes()) {
            adapter.findActiveFootnotes().forEach(dismiss)
          }
        }, hoverDelay)
      }
    }
  }
}
