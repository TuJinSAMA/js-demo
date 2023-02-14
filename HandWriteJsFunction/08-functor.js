// Functor 函子
// 个人简单理解为一个容器 容器内存有函子
// 函子有一个map方法 接收一个函数 此函数才是处理值的函数


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
          .map(x => x * x)
          
console.log(r)
