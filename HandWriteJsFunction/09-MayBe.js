// MayBe 函子
// 可以避免空值报错

class MayBe {
  static of(value) {
    return new MayBe(value)
  }

  constructor(value) {
    this._value = value
  }

  map(fn) {
    return this.isNothing() ? MayBe.of(null) : MayBe.of(fn(this._value))
  }

  isNothing() {
    return this._value === undefined || this._value === null
  }
}

// test
// let r = MayBe.of('hello world').map(x => x.toUpperCase())
let r = MayBe.of(null).map(x => x.toUpperCase()).map(x => null).map(x => x.split(' '))

console.log(r)