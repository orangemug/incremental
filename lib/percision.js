var FRACTIONAL_REGEX = /[-+]?(?:[0-9]*\.([0-9]+)|[0-9]+)/;

/**
 * Returns the number of fractional parts. For example, the numbers `0.001`
 * would return `3`.
 *
 * @param {Number|String} val
 * @return {Number} number of fractional parts
 */
function get(val) {
  var match = val.toString().match(FRACTIONAL_REGEX);
  if(match && match[1]) {
    return match[1].length;
  }
  return 0;
}

/**
 * Return max fractional parts from multiple numbers
 */
function max() {
  var i, len, val, ret = 0;
  for(i=0, len=arguments.length; i<len; i++) {
    val = get(arguments[i])
    if(val > ret) {
      ret = val;
    }
  }
  return ret;
}

module.exports = {
  get: get,
  max: max
};
