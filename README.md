# Incremental
Keybinding to increase/decrease values inside an `<input>`.

[![browser support](https://ci.testling.com/orangemug/incremental.png)](https://ci.testling.com/orangemug/incremental)


## Usage
Basically when you press `MOD+UP/DOWN` or `MOD+UP/DOWN` then it'll increase the value. To bind to an input element

    var el = document.querySelector(".incremental-input");
    var hdl = incremental({
      partials: false,
      modifier: function(e) {
        // These are the default modifiers
        if(e.shiftKey) return 10;
        if(e.altKey) return 0.1;
        return 1;
      }
    });
    el.addEventListener("keydown", hdl, false);

Setting `partials` to true will make it aware of the caret, and allow for multiple values in a single `<input>` to be incremented.


## License
MIT
