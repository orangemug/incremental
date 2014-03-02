/**
 * Set selection of an <input>
 *
 * @param {Element} input
 * @param {Number} start index
 * @param {Number} [end=start] index
 * @return {Element} input
 */
module.exports = function(input, start, end) {
	if(end === undefined) end = start;

  input.selectionStart = start;
  input.selectionEnd = end;
  input.focus();
	return input;
}

