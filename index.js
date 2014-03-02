var percision = require("./lib/percision");
var selectRange = require("./lib/selection");
var numberAtPos = require("./lib/number-at-pos");
var keys = require("./lib/keys");

// Elements bound
var binds = [];

function defaultModifier(e) {
  if(e.shiftKey) return 10;
  if(e.altKey) return 0.1;
}

/**
 * @param {Function|undefined} incrs
 * @param {KeyboardEvent} e
 */
function hdl(opts, e) {
  var tmp, start, end, caret, multiplier, modifier, incr;
  var kc = e.keyCode;
  var el = e.target;
  var val = el.value;
  var origVal = val;

  opts = opts || {};

  modifier = opts.modifier || defaultModifier;

  incr = modifier(e);
  if(incr === undefined) {
    return;
  }

  if(opts.partials) {
    caret = e.target.selectionStart;
    tmp = numberAtPos(val, caret);

    if(tmp) {
      val = tmp.val;
      start = tmp.start;
      end = tmp.end;
    }
  }

  // Is our value a number?
  val = parseFloat(val);
  if(val === undefined) {
    return;
  }

  if(kc === keys.UP) {
    multiplier = 1;
  } else if(kc === keys.DOWN) {
    multiplier = -1;
  } else {
    return;
  }

  // Calc new value
  newVal = (val + incr * multiplier);
  newVal = newVal.toFixed(percision.max(val, incr));

  // Set the value
  if(opts.partials) {
    // Replace in the original string
    caret = start;
    newVal = origVal.slice(0, start) + newVal + origVal.slice(end);
  }

  // Set new value
  el.value = newVal;

  // Reset the selection
  selectRange(el, caret);

  // Prevent the selection from being altered
  e.preventDefault();
}

/**
 * Bind an input
 * @param {HTMLInputElement} el
 * @param {Object} [increments]
 * @return {HTMLInputElement} element passed
 */
function bind(el, opts) {
  var boundFn = hdl.bind(null, opts);
  binds.push({
    el: el,
    hdl: boundFn
  })
  el.addEventListener("keydown", boundFn);
  return el;
}

/**
 * Unbind an input
 * @param {HTMLInputElement} el
 * @return boolean if an element was unbound
 */
function unbind(el) {
  var itemToRemove = binds.find(function(item) {
    return (el === item.el);
  });

  if(itemToRemove) {
    itemToRemove.el.removeEventListener("keydown", itemToRemove.hdl);
    return true;
  }
}

module.exports = {
  // Expose or tests
  _binds: binds,
  _hdl: hdl,
  // API
  bind: bind,
  unbind: unbind
};
