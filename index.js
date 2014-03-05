var percision = require("./lib/percision");
var selectRange = require("./lib/selection");
var numberAtPos = require("./lib/number-at-pos");
var keys = require("./lib/keys");

function defaultModifier(e) {
  if(e.shiftKey) return 10;
  if(e.altKey) return 0.1;
  return 1;
}

function isNaN(v) {
  return v !== v;
}

/**
 * @param {Function|undefined} incrs
 * @param {KeyboardEvent} e
 */
function hdl(opts, e) {
  var tmp, start, end, caret, multiplier, modifier, incr, offset;
  var kc = e.keyCode;
  var el = e.target;
  var val = el.value;
  var origVal = val;

  opts = opts || {};

  if(kc === keys.UP) {
    multiplier = 1;
  } else if(kc === keys.DOWN) {
    multiplier = -1;
  } else {
    return;
  }

  // If up/down keys are pressed always prevent caret movement. This also
  // prevents the selection from being altered
  e.preventDefault();

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
  if(val === undefined || isNaN(val)) {
    return;
  }

  // Calc new value
  newVal = (val + incr * multiplier);
  newVal = newVal.toFixed(percision.max(val, incr));

  // Set the value
  if(opts.partials) {
    if(start === caret && newVal.substring(0,1) === "-") {
      caret += 1;
    }
    // Replace in the original string
    offset = newVal.length - (end-start);
    if(offset < 0 && caret > end+offset) {
      caret += offset;
    }
    newVal = origVal.slice(0, start) + newVal + origVal.slice(end);
  }

  // Set new value
  el.value = newVal;

  // Reset the selection
  selectRange(el, caret);
}

function handler(opts) {
  return function(e) {
    hdl(opts, e);
  }
}

module.exports = handler;
