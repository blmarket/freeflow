async = require 'async'

freeflow = (methods, target_name, callback) ->
  cache = {}
  waiting = {}

  add_waitlist = (target_name, cb) ->
    cur = waiting[target_name] || ( -> return )
    waiting[target_name] = (err, result) ->
      cb err, result
      cur err, result
      return

  inference = (func) ->
    match = func.toString().match(/^function[^(]\(([^)]*)\)/)
    ret = match[1].split(',').map (x) -> x.replace(' ', '')
    ret.pop()
    return ret

  execute = (func_name, cb) ->
    if cache[func_name]
      cb.apply cb, cache[func_name]
      return

    if waiting[func_name]
      add_waitlist func_name, cb
      return

    waiting[func_name] = cb

    func = methods[func_name]
    dependencies = for name in inference(func)
      do (name) -> (cb) -> execute name, cb # capture name when creating callback.

    final_callback = ->
      cache[func_name] = arguments
      waiting[func_name].apply null, arguments
      return

    async.parallel dependencies, (err, results) ->
      (final_callback(err); return) if err?
      results.push final_callback
      func.apply func, results
    return
    
  execute target_name, callback
  return

module.exports.freeflow = freeflow
