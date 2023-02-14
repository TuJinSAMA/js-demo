// monad 单子
// 当一个 IO 函子中 同时拥有 of 和 join 两个方法时 就可以当作单子

const { toUpper, flowRight } = require('lodash/fp')
const fs = require('fs')

class IOMonad {
  static of(value) {
    return new IOMonad(() => value)
  }

  constructor(fn) {
    this._value = fn
  }

  map(fn) {
    return new IOMonad(flowRight(fn, this._value))
  }

  join() {
    return this._value()
  }

  flatMap(fn) {
    return this.map(fn).join()
  }
}

function readFile(filename) {
  return new IOMonad(() => fs.readFileSync(filename, 'utf-8'))
}

function print(data) {
  return new IOMonad(() => {
    console.log(data)
    return data
  })
}

let r = readFile('../package.json')
  .map(toUpper)
  .flatMap(print)

console.log(r.join())