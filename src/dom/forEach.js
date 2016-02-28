/**
 * Iterate over each item in a NodeList.
 *
 * @param  {NodeList} elements List of DOM elements.
 * @param  {Function} callback Callback function.
 */
export default function forEach(elements, callback) {
  for (let i = 0; i < elements.length; i++) {
    callback(elements[i], i)
  }
}
