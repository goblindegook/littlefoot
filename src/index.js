import closest from 'component-closest';
import classList from 'dom-classlist';
import delegate from 'component-delegate';
import events from 'component-event';
import template from 'lodash/template';
import throttle from 'lodash/throttle';
import getMaxHeight from './dom/getMaxHeight';
import createSettings from './settings';
import dismissFootnote from './dismissFootnote';
import getClosestFootnoteButtons from './getClosestFootnoteButtons';
import init from './init';
import repositionFootnote from './repositionFootnote';
import scrollContent from './scrollContent';

/**
 * Littlefoot instance factory.
 *
 * @param  {Object} options Littlefoot options.
 * @return {Object}         Littlefoot instance.
 */
const littlefoot = function(options) {

  const settings = createSettings(options);

  init(settings);

  /**
   * Removes/adds appropriate classes to the footnote content and button after
   * a delay (to allow for transitions) it removes the actual footnote content.
   *
   * @param  {String} footnotes The CSS selector for the footnotes to be removed.
   * @param  {Number} timeout   The delay between adding the removal classes and
   *                            actually removing the popover from the DOM.
   * @return {void}
   */
  function dismissFootnotes(selector = '.littlefoot-footnote', timeout = settings.dismissDelay) {
    const footnotes = document.querySelectorAll(selector);

    Array.prototype.forEach.call(footnotes, (footnote) => {
      dismissFootnote(footnote, timeout);
    });
  }

  /**
   * Positions each footnote relative to its button.
   *
   * @param  {Event} event The type of event that prompted the reposition function.
   * @return {void}
   */
  function repositionFootnotes(event) {
    const footnotes = document.querySelectorAll('.littlefoot-footnote');

    Array.prototype.forEach.call(footnotes, (footnote) => {
      repositionFootnote(footnote, event);
    });
  }

  /**
   * Instantiates the footnote popover of the buttons matching the passed
   * selector. This includes replacing any variables in the content template,
   * decoding any special characters, adding the new element to the page,
   * calling the position function, and adding the scroll handler.
   *
   * @param  {String} selector CSS selector of buttons that are to be activated.
   * @return {Array}           All footnotes activated by the function.
   */
  function displayFootnote(selector) {
    const contentTemplate = template(settings.contentTemplate);
    const buttons         = getClosestFootnoteButtons(selector, settings.allowMultiple);
    const popoversCreated = [];

    buttons.forEach((button) => {
      button.insertAdjacentHTML('afterend', contentTemplate({
        content: button.getAttribute('data-footnote-content'),
        id:      button.getAttribute('data-footnote-id'),
        number:  button.getAttribute('data-footnote-number'),
      }));

      const popover = button.nextElementSibling;
      const content = popover.querySelector('.littlefoot-footnote__content');

      button.setAttribute('aria-expanded', 'true');
      popover.setAttribute('data-footnote-max-height', getMaxHeight(content));
      popover.style.maxWidth = document.body.clientWidth + 'px';

      classList(button).add('is-active');

      events.bind(content, 'mousewheel', throttle(scrollContent));
      events.bind(content, 'wheel', throttle(scrollContent));

      repositionFootnotes();

      popoversCreated.push(popover);

      if (typeof settings.activateCallback === 'function') {
        settings.activateCallback(popover, button);
      }
    });

    setTimeout(() => {
      popoversCreated.forEach((popover) => {
        classList(popover).add('is-active');
      });
    }, settings.activateDelay);

    return popoversCreated;
  }

  /**
   * To activate the popover of a hovered footnote button. Also removes other
   * popovers, if allowMultiple is false.
   *
   * @param  {Event} event Event that contains the target of the mouseenter event.
   * @return {void}
   */
  function onHover(event) {
    if (!settings.activateOnHover) {
      return;
    }

    const target     = event.target || event.srcElement;
    const footnote   = closest(target, '.littlefoot-footnote__button');
    const footnoteId = footnote.getAttribute('data-footnote-id');
    const selector   = `[data-footnote-id="${footnoteId}"]`;

    if (classList(footnote).contains('is-active')) {
      return;
    }

    if (!settings.allowMultiple) {
      dismissFootnotes(`.littlefoot-footnote:not(${selector})`);
    }

    classList(footnote).add('is-hover-instantiated');

    const popovers = displayFootnote('.littlefoot-footnote__button' + selector);

    popovers.forEach((popover) => {
      classList(popover).add('is-hover-instantiated');
    });
  }

  /**
   * Handles the logic of clicking/tapping the footnote button. That is,
   * activates the popover if it isn't already active (+ deactivate others, if
   * appropriate) or, deactivates the popover if it is already active.
   *
   * @param  {DOMElement} button Button being clicked/pressed.
   * @return {void}
   */
  function activateButton(button) {
    const isActive   = classList(button).contains('is-active');
    const isChanging = classList(button).contains('changing');
    const footnoteId = button.getAttribute('data-footnote-id');
    const selector   = `[data-footnote-id="${footnoteId}"]`;

    if (typeof button.blur === 'function') {
      button.blur();
    }

    if (isChanging) {
      return;
    }

    if (isActive) {
      dismissFootnotes('.littlefoot-footnote' + selector);
      return;
    }

    if (!settings.allowMultiple) {
      dismissFootnotes('.littlefoot-footnote:not(' + selector + ')');
    }

    // Activate footnote:
    classList(button).add('changing');
    classList(button).add('is-click-instantiated');
    displayFootnote('.littlefoot-footnote__button' + selector);

    setTimeout(() => {
      classList(button).remove('changing');
    }, settings.activateDelay);
  }

  /**
   * Activates the button the was clicked/taps. Also removes other popovers, if
   * allowMultiple is false. Finally, removes all popovers if something non-fn
   * related was clicked/tapped.
   *
   * @param  {Event} event Event that contains the target of the tap/click event.
   * @return {void}
   */
  function onTouchClick(event) {
    const button   = closest(event.target, '.littlefoot-footnote__button');
    const footnote = closest(event.target, '.littlefoot-footnote');

    if (button) {
      event.preventDefault();
      activateButton(button);
    }

    if (!button && !footnote && document.querySelector('.littlefoot-footnote')) {
      dismissFootnotes();
    }
  }

  /**
   * Removes the unhovered footnote content if dismissOnUnhover is true.
   *
   * @return {void}
   */
  function onUnhover() {
    if (!settings.dismissOnUnhover || !settings.activateOnHover) {
      return;
    }

    setTimeout(() => {
      if (!document.querySelector('.littlefoot-footnote__button:hover, .littlefoot-footnote:hover')) {
        dismissFootnotes();
      }
    }, settings.hoverDelay);
  }

  /**
   * Remove all popovers on keypress.
   *
   * @param  {Event} event Event that contains the key that was pressed.
   * @return {void}
   */
  function onEscapeKeypress(event) {
    if (event.keyCode === 27) {
      dismissFootnotes();
    }
  }

  events.bind(document, 'touchend', onTouchClick);
  events.bind(document, 'click', onTouchClick);
  events.bind(document, 'keyup', onEscapeKeypress);
  events.bind(document, 'gestureend', repositionFootnotes);
  events.bind(window, 'scroll', throttle(repositionFootnotes));
  events.bind(window, 'resize', throttle(repositionFootnotes));

  delegate.bind(document, '.littlefoot-footnote__button', 'mouseover', onHover);
  delegate.bind(document, '.is-hover-instantiated', 'mouseout', onUnhover);

  return {
    activate:      displayFootnote,
    dismiss:       dismissFootnotes,
    getSetting:    settings.get,
    updateSetting: settings.set,
  };
};

export default littlefoot;
