var incr = require("../");
var test = require('tape');


function fakeEvent(keyCode) {
  return {
    target: target,
    keyCode: keyCode,
    preventDefault: preventDefault
  };
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

var target = document.createElement("input");
document.body.appendChild(target);

test('increase when shift+UP pressed', function(t) {
  target.value = "30";
  var e = {target: target, shiftKey: true, keyCode: KEYS.up};
  incr._hdl(undefined, e);
  t.equal(target.value, "40");
  t.end();
});

test('decrease when shift+DOWN pressed', function(t) {
  target.value = "30";
  var e = {target: target, shiftKey: true, keyCode: KEYS.down};
  incr._hdl(undefined, e);
  t.equal(target.value, "20");
  t.end();
});

test('increase when alt+UP pressed', function(t) {
  target.value = "30.3";
  var e = {target: target, altKey: true, keyCode: KEYS.up};
  incr._hdl(undefined, e);
  t.equal(target.value, "30.4");
  t.end();
});

test('decrease when alt+DOWN pressed', function(t) {
  target.value = "30.3";
  var e = {target: target, altKey: true, keyCode: KEYS.down};
  incr._hdl(undefined, e);
  t.equal(target.value, "30.2");
  t.end();
});

test('decrease by FLOAT when mod+UP pressed on INT', function(t) {
  target.value = "30";
  var e = {target: target, keyCode: KEYS.up};
  incr._hdl({modifier: testFuns.ret0pt1}, e);
  t.equal(target.value, "30.01");
  t.end();
});

test('increase by FLOAT when mod+DOWN pressed on INT', function(t) {
  target.value = "30";
  var e = {target: target, keyCode: KEYS.down};
  incr._hdl({modifier: testFuns.ret0pt1}, e);
  t.equal(target.value, "29.99");
  t.end();
});

test('decrease by INT when mod+UP pressed on INT', function(t) {
  target.value = "30";
  var e = {target: target, keyCode: KEYS.up};
  incr._hdl({modifier: testFuns.ret1}, e);
  t.equal(target.value, "31");
  t.end();
});

test('increase by INT when mod+DOWN pressed on INT', function(t) {
  target.value = "30";
  var e = {target: target, keyCode: KEYS.down};
  incr._hdl({modifier: testFuns.ret1}, e);
  t.equal(target.value, "29");
  t.end();
});

test('decrease by FLOAT when mod+UP pressed on FLOAT', function(t) {
  target.value = "30.1";
  var e = {target: target, keyCode: KEYS.up};
  incr._hdl({modifier: testFuns.ret0pt1}, e);
  t.equal(target.value, "30.11");
  t.end();
});

test('increase by FLOAT when mod+DOWN pressed on FLOAT', function(t) {
  target.value = "30.1";
  var e = {target: target, keyCode: KEYS.down};
  incr._hdl({modifier: testFuns.ret0pt1}, e);
  t.equal(target.value, "30.09");
  t.end();
});

test('increase by FLOAT when mod+DOWN pressed on FLOAT', function(t) {
  target.value = "30.1";
  var e = {target: target, keyCode: KEYS.down};
  incr._hdl({modifier: testFuns.ret0pt1}, e);
  t.equal(target.value, "30.09");
  t.end();
});

test('support for a partial number string', function(t) {
  target.value = "top: 1.2px";
  selectRange(target, 6);
  var e = {target: target, keyCode: KEYS.down};
  incr._hdl({modifier: testFuns.ret0pt1, partials: true}, e);
  t.equal(target.value, "top: 1.19px");
  t.end();
});

test('support for multiple partial numbers string', function(t) {
  target.value = "rgba(225, 200, 100, 0.5)";

  selectRange(target, 5);
  var e = {target: target, keyCode: KEYS.down};
  incr._hdl({modifier: testFuns.ret1, partials: true}, e);
  t.equal(target.value, "rgba(224, 200, 100, 0.5)");

  selectRange(target, 11);
  var e = {target: target, keyCode: KEYS.down};
  incr._hdl({modifier: testFuns.ret1, partials: true}, e);
  t.equal(target.value, "rgba(224, 199, 100, 0.5)");

  selectRange(target, 17);
  var e = {target: target, keyCode: KEYS.down};
  incr._hdl({modifier: testFuns.ret1, partials: true}, e);
  t.equal(target.value, "rgba(224, 199, 99, 0.5)");

  selectRange(target, 20);
  var e = {target: target, keyCode: KEYS.down};
  incr._hdl({modifier: testFuns.ret0pt1, partials: true}, e);
  t.equal(target.value, "rgba(224, 199, 99, 0.49)");

  t.end();
});

