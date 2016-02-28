/**
 * Removes any links from the footnote back to the footnote link as these don't
 * make sense when the footnote is shown inline.
 *
 * @param  {String} content      The HTML string of the new footnote.
 * @param  {String} backlinkId   The ID of the footnote link (that is to be
 *                               removed from the footnote HTML).
 * @return {String}              The new HTML string with the relevant links
 *                               taken out.
 */
export default function prepareContent(content, backlinkId) {
  if (backlinkId.indexOf(' ') >= 0) {
    backlinkId = backlinkId.trim().replace(/\s+/g, '|').replace(/(.*)/g, '($1)')
  }

  const regex = new RegExp('(\\s|&nbsp;)*<\\s*a[^#<]*#' + backlinkId + '[^>]*>(.*?)<\\s*/\\s*a>', 'g')

  content = content.trim().replace(regex, '').replace('[]', '')

  if (content.indexOf('<') !== 0) {
    content = '<p>' + content + '</p>';
  }

  return content
}
