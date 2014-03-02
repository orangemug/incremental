var incremental = require("../");

document.addEventListener('DOMContentLoaded', function() {
  var el = document.querySelector(".color-selector input");
  incremental.bind(el, {
    partials: true,
    modifier: function(e) {
      if(e.altKey) return 30;
      if(e.shiftKey) return 10;
      return 1;
    }
  });

  el.addEventListener("keydown", function(e) {
    var v = e.target.value;
    document.body.style.backgroundColor = v;

    var cs = window.getComputedStyle(document.body);
    if(cs.backgroundColor !== v) {
      el.classList.add("err");
    } else {
      el.classList.remove("err");
    }
  }, false);
}, false);
