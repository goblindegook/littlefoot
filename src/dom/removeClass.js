/**
 * [removeClass description]
 *
 * @param  {DOMElement} element   [description]
 * @param  {String}     className [description]
 */
export default function removeClass(element, className) {
  if (element.classList) {
    element.classList.remove(className)
  } else {
    const replacePattern = new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi')
    element.className = element.className.replace(replacePattern, '')
  }
}
