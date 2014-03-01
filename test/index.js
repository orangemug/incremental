var incr = require("../");
var test = require('tape');


function fakeEvent(keyCode, obj) {
  var target = document.createElement("input");
  document.body.appendChild(target);

  obj = obj || {};
  obj.target = target;
  obj.keyCode = keyCode;
  obj.preventDefault = function() {};
  obj.destroy = function() {
    document.body.removeChild(target);
  }
  return obj;
}

// <http://help.dottoro.com/ljtfkhio.php>
function selectRange(input, idx) {
  if ('selectionStart' in input) {
    input.selectionStart = idx;
    input.selectionEnd = idx;
    input.focus();
  }
  else {  // Internet Explorer before version 9
    var inputRange = input.createTextRange ();
    inputRange.moveStart ("character", idx);
    inputRange.collapse ();
    inputRange.moveEnd ("character", idx);
    inputRange.select();
  }
}



var KEYS = {
  up: 38,
  down: 40
};

var testFuns = {
  ret1: function(e) {
    return 1;
  },
  ret0pt1: function(e) {
    return 0.01;
  }
};

test('increase when shift+UP pressed', function(t) {
  var e = fakeEvent(KEYS.up, {shiftKey: true});
  e.target.value = "30";
  incr._hdl(undefined, e);
  t.equal(e.target.value, "40");

  e.destroy();
  t.end();
});

test('decrease when shift+DOWN pressed', function(t) {
  var e = fakeEvent(KEYS.down, {shiftKey: true});
  e.target.value = "30";
  incr._hdl(undefined, e);
  t.equal(e.target.value, "20");

  e.destroy();
  t.end();
});

test('increase when alt+UP pressed', function(t) {
  var e = fakeEvent(KEYS.up, {altKey: true});
  e.target.value = "30.3";
  incr._hdl(undefined, e);
  t.equal(e.target.value, "30.4");

  e.destroy();
  t.end();
});

test('decrease when alt+DOWN pressed', function(t) {
  var e = fakeEvent(KEYS.down, {altKey: true});
  e.target.value = "30.3";
  incr._hdl(undefined, e);
  t.equal(e.target.value, "30.2");

  e.destroy();
  t.end();
});

test('decrease by FLOAT when mod+UP pressed on INT', function(t) {
  var e = fakeEvent(KEYS.up);
  e.target.value = "30";
  incr._hdl({modifier: testFuns.ret0pt1}, e);
  t.equal(e.target.value, "30.01");

  e.destroy();
  t.end();
});

test('increase by FLOAT when mod+DOWN pressed on INT', function(t) {
  var e = fakeEvent(KEYS.down);
  e.target.value = "30";
  incr._hdl({modifier: testFuns.ret0pt1}, e);
  t.equal(e.target.value, "29.99");

  e.destroy();
  t.end();
});

test('decrease by INT when mod+UP pressed on INT', function(t) {
  var e = fakeEvent(KEYS.up);
  e.target.value = "30";
  incr._hdl({modifier: testFuns.ret1}, e);
  t.equal(e.target.value, "31");

  e.destroy();
  t.end();
});

test('increase by INT when mod+DOWN pressed on INT', function(t) {
  var e = fakeEvent(KEYS.down);
  e.target.value = "30";
  incr._hdl({modifier: testFuns.ret1}, e);
  t.equal(e.target.value, "29");

  e.destroy();
  t.end();
});

test('decrease by FLOAT when mod+UP pressed on FLOAT', function(t) {
  var e = fakeEvent(KEYS.up);
  e.target.value = "30.1";
  incr._hdl({modifier: testFuns.ret0pt1}, e);
  t.equal(e.target.value, "30.11");

  e.destroy();
  t.end();
});

test('increase by FLOAT when mod+DOWN pressed on FLOAT', function(t) {
  var e = fakeEvent(KEYS.down);
  e.target.value = "30.1";
  incr._hdl({modifier: testFuns.ret0pt1}, e);
  t.equal(e.target.value, "30.09");

  e.destroy();
  t.end();
});

test('increase by FLOAT when mod+DOWN pressed on FLOAT', function(t) {
  var e = fakeEvent(KEYS.down);
  e.target.value = "30.1";
  incr._hdl({modifier: testFuns.ret0pt1}, e);
  t.equal(e.target.value, "30.09");

  e.destroy();
  t.end();
});

test('support for a partial number string', function(t) {
  var e = fakeEvent(KEYS.down);
  e.target.value = "top: 1.2px";
  selectRange(e.target, 6);
  incr._hdl({modifier: testFuns.ret0pt1, partials: true}, e);
  t.equal(e.target.value, "top: 1.19px");

  e.destroy();
  t.end();
});

test('support for multiple partial numbers string', function(t) {
  var e = fakeEvent(KEYS.down);
  e.target.value = "rgba(225, 200, 100, 0.5)";
  selectRange(e.target, 5);

  incr._hdl({modifier: testFuns.ret1, partials: true}, e);
  t.equal(e.target.value, "rgba(224, 200, 100, 0.5)");

  selectRange(e.target, 11);
  incr._hdl({modifier: testFuns.ret1, partials: true}, e);
  t.equal(e.target.value, "rgba(224, 199, 100, 0.5)");

  selectRange(e.target, 17);
  incr._hdl({modifier: testFuns.ret1, partials: true}, e);
  t.equal(e.target.value, "rgba(224, 199, 99, 0.5)");

  selectRange(e.target, 20);
  incr._hdl({modifier: testFuns.ret0pt1, partials: true}, e);
  t.equal(e.target.value, "rgba(224, 199, 99, 0.49)");

  e.destroy();
  t.end();
});

