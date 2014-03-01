var FLOAT_REGEX = /^[0-9]+\.?([0-9]*)/;
var KEYS = {
  up: 38,
  down: 40
};

// Elements bound
var binds = [];

function defaultModifier(e) {
  if(e.shiftKey) return 10;
  if(e.altKey) return 0.1;
}

/**
 * Is the value an integer?
 * @param {String|Number} v
 * @return {Number|undefined} number if valid int
 */
function isInt(v) {
  var nv = parseInt(v, 10);
  return (nv == v ? nv : undefined);
}

/**
 * Is the value an float?
 * @param {String|Number} v
 * @return {Number|undefined} number if valid float
 */
function isFloat(v) {
  var nv = parseFloat(v);
  return (nv == v ? nv : undefined);
}

/**
 * @param {Function|undefined} incrs
 * @param {KeyboardEvent} e
 */
function hdl(opts, e) {
  var mod, incr, nVal, intVal, floatVal, floatStr, dp;
  var kc = e.keyCode;
  var val = e.target.value;
  var el = e.target;
  var start, end, match;
  var origVal = val;
  var caret = e.target.selectionStart;
  opts = opts || {};

  if(opts.partials) {
    var str = val;
    var re = /([-+]?(?:[0-9]*\.[0-9]+|[0-9]+))/g;

    while(!!(rslt = (re.exec(val)))) {
      start = rslt.index;
      end = rslt[1].length+start;
      if(caret >= start && caret <= end) {
        match = true;
        val = rslt[1];
        break;
      }
    }
    if(!match) {
      return;
    }
  }

  modifier = opts.modifier || defaultModifier;

  var incr = modifier(e);
  if(incr === undefined) {
    return;
  }

  // Are our values numbers?
  intVal   = isInt(val);
  floatVal = isFloat(val);

  if(intVal) {
    val = intVal;
  } else if(floatVal) {
    val = floatVal;
  } else {
    return;
  }

  if(kc === KEYS.up) {
    mod = 1;
  } else if(kc === KEYS.down) {
    mod = -1;
  } else {
    return;
  }


  nVal = (val + incr * mod);

  valStr        = val.toString();
  incrStr       = incr.toString();
  valPercision  = valStr.match(FLOAT_REGEX)[1].length;
  incrPercision = incrStr.match(FLOAT_REGEX)[1].length;

  if(valPercision > incrPercision) {
    nVal = nVal.toFixed(valPercision);
  } else {
    nVal = nVal.toFixed(incrPercision);
  }

  // Set the value
  if(opts.partials) {
    // Replace in the original string
    el.value = origVal.slice(0, start) + nVal + origVal.slice(end);
  } else {
    el.value = nVal;
  }

  e.target.selectionStart = caret;
  e.target.selectionEnd = caret;
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
