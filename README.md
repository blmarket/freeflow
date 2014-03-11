Freeflow
--------

Another control-flow extension for some places where [async](https://github.com/caolan/async) doesn't covers.

### What this library for?

async.auto is great feature which offers simple dependency resolution, but it doesn't have target function so
all the functions are to be executed. If you have bunch of functions and needs only some of them are to be executed
to get needed value, other functions are executed with no use.

    async.auto({
      foo: function(callback) { ... }
      bar: function(callback) { ... }
      baz: [ 'foo', function(callback) { ... } ]
    });

Think if we only need the result of baz. then bar don't needed to executed in this context but async doesn't have
that feature. that's why I coded this library.

### How to use?

    var freeflow = require('freeflow');
    freeflow({
      funcA: function(callback) { ... },
      funcB: function(callback) { ... },
      funcC: function(funcA, funcB, callback) { ... } // dependencies are auto-inferenced
    }, 'funcC', function(err, result) {
      ...
    });

### TODO

* Alternative way without dependency inference.
