import { UseCaseSettings } from './use-cases'
import {
  CLASS_CONTENT,
  CLASS_WRAPPER,
  HTMLAdapterSettings,
} from './dom/document'
import { CLASS_TOOLTIP } from './dom/layout'

export type Settings = HTMLAdapterSettings & UseCaseSettings<HTMLElement>

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
  contentTemplate: `<aside class="littlefoot__popover" id="fncontent:<% id %>"><div class="${CLASS_WRAPPER}"><div class="${CLASS_CONTENT}"><% content %></div></div><div class="${CLASS_TOOLTIP}"></div></aside>`,
  buttonTemplate: `<button class="littlefoot__button" id="<% reference %>" title="See Footnote <% number %>"><svg role="img" aria-labelledby="title-<% reference %>" viewbox="0 0 31 6" preserveAspectRatio="xMidYMid"><title id="title-<% reference %>">Footnote <% number %></title><circle r="3" cx="3" cy="3" fill="white"></circle><circle r="3" cx="15" cy="3" fill="white"></circle><circle r="3" cx="27" cy="3" fill="white"></circle></svg></button>`,
}
