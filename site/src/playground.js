import { littlefoot } from 'littlefoot'

const DOTS_TEMPLATE = `<button
  aria-label="Footnote <% number %>"
  aria-expanded="false"
  class="littlefoot__button"
  id="<% reference %>"
  ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 2">
    <circle r="1" cx="1" cy="1" fill="currentColor"/>
    <circle r="1" cx="4" cy="1" fill="currentColor"/>
    <circle r="1" cx="7" cy="1" fill="currentColor"/>
  </svg></button>`

const NUMERIC_TEMPLATE = `<button
  aria-label="Footnote <% number %>"
  aria-expanded="false"
  class="littlefoot__button littlefoot__button--numeric"
  id="<% reference %>"
  ><% number %></button>`

export function initPlayground() {
  const articleEl = document.getElementById('demo-article')
  if (!articleEl) return null

  const state = {
    scope: 'body',
    numberResetSelector: '#demo-article, #api',
    anchorPattern: /#fn:(?:pg-\d+|button-template-default|content-template-default)$/i,
    footnoteSelector: '.footnotes li',
    activateOnHover: false,
    allowMultiple: false,
    dismissOnUnhover: false,
    dismissOnDocumentTouch: true,
    activateDelay: 100,
    hoverDelay: 250,
    buttonTemplate: DOTS_TEMPLATE,
  }

  let lf = littlefoot(state)

  let hasAutoOpened = false
  const autoOpenFirstPopover = () => {
    if (hasAutoOpened) return
    hasAutoOpened = true
    window.setTimeout(() => lf.activate('1'), 120)
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        autoOpenFirstPopover()
        currentObserver.disconnect()
      },
      { threshold: 0.35 },
    )
    observer.observe(articleEl)
  } else {
    autoOpenFirstPopover()
  }

  function reinit() {
    lf.unmount()
    lf = littlefoot({ ...state })
  }

  const hintEl = document.querySelector('.playground__hint')
  const hintBaseText = hintEl?.textContent?.trim() ?? ''
  const HINT_MESSAGES = [
    'Live update applied to the demo footnotes.',
    'Popover behavior updated instantly.',
    'Nice tune. That setting combo reads cleanly.',
  ]
  let hintIndex = 0
  let hintResetTimer = 0

  if (hintEl) {
    hintEl.setAttribute('aria-live', 'polite')
  }

  function popElement(el) {
    if (!el || document.body.classList.contains('reduced-motion')) return
    el.classList.remove('delight-pop')
    void el.offsetHeight
    el.classList.add('delight-pop')
    window.setTimeout(() => el.classList.remove('delight-pop'), 300)
  }

  function nudgeHint() {
    if (!hintEl || !hintBaseText) return
    const message = HINT_MESSAGES[hintIndex % HINT_MESSAGES.length]
    hintIndex += 1
    hintEl.textContent = message
    hintEl.classList.add('is-delight')

    if (hintResetTimer) window.clearTimeout(hintResetTimer)
    hintResetTimer = window.setTimeout(() => {
      hintEl.textContent = hintBaseText
      hintEl.classList.remove('is-delight')
    }, 1700)
  }

  const TOGGLE_KEYS = ['allowMultiple', 'dismissOnDocumentTouch']

  for (const key of TOGGLE_KEYS) {
    const btn = document.getElementById(`setting-${key}`)
    if (!btn) continue

    btn.addEventListener('click', () => {
      const next = !state[key]
      state[key] = next
      btn.setAttribute('aria-checked', String(next))
      btn.classList.toggle('is-on', next)
      lf.updateSetting(key, next)
      popElement(btn)
      nudgeHint()
    })
  }

  const hoverModeBtn = document.getElementById('setting-hoverMode')

  function setHoverMode(enabled, updateSettings = true) {
    state.activateOnHover = enabled
    state.dismissOnUnhover = enabled

    if (hoverModeBtn) {
      hoverModeBtn.setAttribute('aria-checked', String(enabled))
      hoverModeBtn.classList.toggle('is-on', enabled)
    }

    if (updateSettings) {
      lf.updateSetting('activateOnHover', enabled)
      lf.updateSetting('dismissOnUnhover', enabled)
    }

    syncHoverDelayState()
  }

  if (hoverModeBtn) {
    hoverModeBtn.addEventListener('click', () => {
      const next = !(state.activateOnHover && state.dismissOnUnhover)
      setHoverMode(next)
      popElement(hoverModeBtn)
      nudgeHint()
    })
  }

  function syncHoverDelayState() {
    const hoverActive = state.activateOnHover && state.dismissOnUnhover
    const slider = document.getElementById('setting-hoverDelay')
    const row = document.getElementById('row-hoverDelay')
    const hoverModeRow = document.getElementById('row-hoverMode')
    if (!slider || !row) return

    row.hidden = !hoverActive
    slider.disabled = !hoverActive
    slider.setAttribute('aria-disabled', String(!hoverActive))
    if (hoverModeRow) {
      hoverModeRow.classList.toggle('setting-row--no-divider', !hoverActive)
    }
  }

  syncHoverDelayState()

  const SLIDER_KEYS = ['activateDelay', 'hoverDelay']

  for (const key of SLIDER_KEYS) {
    const slider = document.getElementById(`setting-${key}`)
    const display = document.getElementById(`value-${key}`)
    if (!slider) continue

    slider.addEventListener('input', () => {
      const val = Number(slider.value)
      state[key] = val
      slider.setAttribute('aria-valuenow', String(val))
      if (display) display.textContent = `${val}ms`
      lf.updateSetting(key, val)
    })

    slider.addEventListener('change', () => {
      popElement(slider)
      nudgeHint()
    })
  }

  const buttonStyleButtons = [
    document.getElementById('setting-buttonStyle-dots'),
    document.getElementById('setting-buttonStyle-numeric'),
  ].filter(Boolean)

  for (const button of buttonStyleButtons) {
    button.addEventListener('click', () => {
      const style = button.dataset.buttonStyle
      state.buttonTemplate = style === 'numeric' ? NUMERIC_TEMPLATE : DOTS_TEMPLATE

      for (const btn of buttonStyleButtons) {
        const selected = btn === button
        btn.classList.toggle('is-active', selected)
        btn.setAttribute('aria-pressed', String(selected))
      }

      reinit()
      popElement(button)
      nudgeHint()
    })
  }

  const themeButtons = [
    document.getElementById('setting-theme-light'),
    document.getElementById('setting-theme-dark'),
  ].filter(Boolean)

  for (const button of themeButtons) {
    button.addEventListener('click', () => {
      const theme = button.dataset.theme
      articleEl.classList.toggle('demo-dark', theme === 'dark')

      for (const btn of themeButtons) {
        const selected = btn === button
        btn.classList.toggle('is-active', selected)
        btn.setAttribute('aria-pressed', String(selected))
      }

      popElement(button)
      nudgeHint()
    })
  }

  if (themeButtons.length > 0) {
    const selectedThemeButton =
      themeButtons.find((button) => button.classList.contains('is-active')) ?? themeButtons[0]
    articleEl.classList.toggle('demo-dark', selectedThemeButton.dataset.theme === 'dark')
  }

  if (buttonStyleButtons.length > 0) {
    const selectedStyleButton =
      buttonStyleButtons.find((button) => button.classList.contains('is-active')) ?? buttonStyleButtons[0]
    state.buttonTemplate =
      selectedStyleButton.dataset.buttonStyle === 'numeric' ? NUMERIC_TEMPLATE : DOTS_TEMPLATE
  }

  if (hoverModeBtn) {
    const hoverModeEnabled = hoverModeBtn.getAttribute('aria-checked') === 'true'
    setHoverMode(hoverModeEnabled, false)
  } else {
    setHoverMode(false, false)
  }
}
