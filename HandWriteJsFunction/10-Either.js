// Either 函子
// 可以用来处理异常

class Left {
  static of(value) {
    return new Left(value)
  }

  constructor(value) {
    this._value = value
  }

  map(fn) {
    return this
  }
}

class Right {
  static of(value) {
    return new Right(value)
  }

  constructor(value) {
    this._value = value
  }

  map(fn) {
    return Right.of(fn(this._value))
  }
}

function parseJSON(json) {
  try {
    return Right.of(JSON.parse(json))
  } catch (e) {
    return Left.of({error: e.message})
  }
}

const json = '{"name": "zs"}'

console.log(parseJSON(json).map(x => x.name.toUpperCase()))