// pointed 函子其实就是 之前的函子定义的 of 方法
// 作用是将一个值 进行包装 使其可以在上下文中可访问

class Container {
  static of(value) {
    return new Container(value) 
  }

  constructor(value) {
    this._value = value
  }

  map(fn) {
    return Container.of(fn(this._value))
  }
}

// test 
let r =Container.of(3)
          .map(x => x + 3)
          