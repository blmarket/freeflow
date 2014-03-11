{freeflow} = require '../src/freeflow'

test = ->
  # expected result: 357
  freeflow({
    funcA: (cb) ->
      cb null, 123
      return
    funcB: (cb) -> cb null, 234; return
    funcC: (funcA, funcB, cb) ->
      cb null, funcA + funcB
      return
  }, 'funcC', ->
    console.log arguments
    return
  )

  # # expected result: throws RangeError
  # freeflow({
  #   funcA: (funcB, cb) ->
  #     cb null, 123
  #     return
  #   funcB: (funcA, cb) -> cb null, 234; return
  #   funcC: (funcA, funcB, cb) ->
  #     cb null, funcA + funcB
  #     return
  # }, 'funcC', ->
  #   console.log arguments
  #   return
  # )

  ## funcA should be called only once.
  freeflow({
    funcA: (cb) ->
      cb null, 123
      return
    funcB: (funcA, cb) -> cb null, funcA + 111; return
    funcC: (funcA, funcB, cb) ->
      cb null, funcA + funcB
      return
  }, 'funcC', ->
    console.log arguments
    return
  )

  freeflow({
    funcA: (cb) ->
      setTimeout(
        ->
          cb null, 123
          return
        500
      )
      return
    funcB: (funcA, cb) -> cb null, funcA + 111; return
    funcC: (funcA, funcB, cb) ->
      cb null, funcA + funcB
      return
  }, 'funcC', ->
    console.log arguments
    return
  )

  freeflow({
    funcA: (cb) ->
      setTimeout(
        ->
          cb null, 123
          return
        500
      )
      return
    funcB: (funcA, cb) -> cb null, funcA + 111; return
    funcC: [ 'funcA', 'funcB', (a_result, b_result, cb) ->
      cb null, a_result + b_result
      return
    ]
  }, 'funcC', ->
    console.log arguments
    return
  )

  return

test()
