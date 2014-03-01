# incremental
Increase/decrease values inside an `<input>` when you press `MOD+UP/DOWN` or `MOD+UP/DOWN`

## Usage
Bind to an input element

    var el = document.querySelector(".incremental-input");
    incremental.bind(el, {
      // Faster if you don't require partial support
      partials: true,
      modifier: function(e) {
        // These are the default modifiers
        if(e.shiftKey) return 10;
        if(e.altKey) return 0.1;
      }
    });

And to destroy the binding

    incremental.unbind(el);

