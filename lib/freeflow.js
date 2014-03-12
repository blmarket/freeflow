var async, freeflow,
  __slice = [].slice;

async = require('async');

freeflow = function(methods, target_name, callback) {
  var add_waitlist, cache, execute, inference, waiting;
  cache = {};
  waiting = {};
  add_waitlist = function(target_name, cb) {
    var cur;
    cur = waiting[target_name] || (function() {});
    return waiting[target_name] = function(err, result) {
      cb(err, result);
      cur(err, result);
    };
  };
  inference = function(func) {
    var match, ret;
    ret = null;
    if (!Array.isArray(func)) {
      match = func.toString().match(/^function[^(]\(([^)]*)\)/);
      ret = match[1].split(',').map(function(x) {
        return x.replace(' ', '');
      });
      ret[ret.length - 1] = func;
    } else {
      ret = func;
    }
    return ret;
  };
  execute = function(func_name, cb) {
    var dependencies, final_callback, func, name, names, _i, _ref;
    if (cache[func_name]) {
      cb.apply(cb, cache[func_name]);
      return;
    }
    if (waiting[func_name]) {
      add_waitlist(func_name, cb);
      return;
    }
    waiting[func_name] = cb;
    _ref = inference(methods[func_name]), names = 2 <= _ref.length ? __slice.call(_ref, 0, _i = _ref.length - 1) : (_i = 0, []), func = _ref[_i++];
    dependencies = (function() {
      var _j, _len, _results;
      _results = [];
      for (_j = 0, _len = names.length; _j < _len; _j++) {
        name = names[_j];
        _results.push((function(name) {
          return function(cb) {
            return execute(name, cb);
          };
        })(name));
      }
      return _results;
    })();
    final_callback = function() {
      cache[func_name] = arguments;
      waiting[func_name].apply(null, arguments);
    };
    async.parallel(dependencies, function(err, results) {
      if (err != null) {
        final_callback(err);
        return;
      }
      results.push(final_callback);
      return func.apply(func, results);
    });
  };
  execute(target_name, callback);
};

module.exports.freeflow = freeflow;
