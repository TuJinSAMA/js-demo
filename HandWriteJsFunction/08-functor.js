// Functor 函子

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
