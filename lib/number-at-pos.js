/**
 * Get the number string at pos. For example given the position `7` and string
 *
 *     "rgba(200, 100, 0)"
 *            ^
 *            |
 *            |
 *          [pos]
 *
 * It'll return
 *
 *     {val: 200, start: 6, end: 8};
 *
 * @param {Number|String} val
 * @param {Number} pos
 */
module.exports = function(val, pos) {
  var rslt, start, end, re = /([-+]?(?:[0-9]*\.[0-9]+|[0-9]+))/g;
	val = val.toString();

  while(!!(rslt = (re.exec(val)))) {
    start = rslt.index;
    end = rslt[1].length+start;

    if(pos >= start && pos <= end) {
      return {
        start: start,
        end:   end,
        val:   rslt[1]
      }
    }
  }
}

