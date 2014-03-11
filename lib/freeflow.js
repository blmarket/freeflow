var async, freeflow;

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
    match = func.toString().match(/^function[^(]\(([^)]*)\)/);
    ret = match[1].split(',').map(function(x) {
      return x.replace(' ', '');
    });
    ret.pop();
    return ret;
  };
  execute = function(func_name, cb) {
    var dependencies, final_callback, func, name;
    if (cache[func_name]) {
      cb.apply(cb, cache[func_name]);
      return;
    }
    if (waiting[func_name]) {
      add_waitlist(func_name, cb);
      return;
    }
    waiting[func_name] = cb;
    func = methods[func_name];
    dependencies = (function() {
      var _i, _len, _ref, _results;
      _ref = inference(func);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
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
