import { CLASS_WRAPPER, CLASS_CONTENT, CLASS_TOOLTIP } from './dom/layout'

export type ActionCallback = (popover: HTMLElement, button: HTMLElement) => void

export type Settings = Readonly<{
  activateCallback?: ActionCallback
  dismissCallback?: ActionCallback
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
  numberResetSelector: string
  scope: string
}>

export const DEFAULT_SETTINGS: Settings = {
  activateDelay: 100,
  activateOnHover: false,
  allowDuplicates: true,
  allowMultiple: false,
  anchorParentSelector: 'sup',
  anchorPattern: /(fn|footnote|note)[:\-_\d]/gi,
  dismissDelay: 100,
  dismissOnUnhover: false,
  footnoteSelector: 'li',
  hoverDelay: 250,
  numberResetSelector: '',
  scope: '',
  contentTemplate: `<aside class="littlefoot-footnote" id="fncontent:<% id %>"><div class="${CLASS_WRAPPER}"><div class="${CLASS_CONTENT}"><% content %></div></div><div class="${CLASS_TOOLTIP}"></div></aside>`,
  buttonTemplate: `<button class="littlefoot-footnote__button littlefoot-footnote__button__ellipsis" id="<% reference %>" title="See Footnote <% number %>" aria-expanded="false"><svg role="img" aria-labelledby="title-<% reference %>" viewbox="0 0 31 6" preserveAspectRatio="xMidYMid"><title id="title-<% reference %>">Footnote <% number %></title><circle r="3" cx="3" cy="3" fill="white"></circle><circle r="3" cx="15" cy="3" fill="white"></circle><circle r="3" cx="27" cy="3" fill="white"></circle></svg></button>`,
}
