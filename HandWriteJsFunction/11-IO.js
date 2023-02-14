const _ = require('lodash')


// IO 函子
// 该函子中的 _value 是一个函数 将含有副作用的函数交给调用者去处理

class IO {
  static of(value) {
    return new IO(() => value)
  }

  constructor(fn) {
    this._value = fn
  }

  map(fn) {
    return new IO(_.flowRight(fn, this._value))
  }
}

const r = IO.of(process).map(p => p.execPath)

console.log(r._value())
