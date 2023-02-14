// folktale 库 支持了 compose curry 等函数式编程的方法以及函子
const { first, toUpper } = require('lodash/fp')
const { compose, curry } = require('folktale/core/lambda')

// let f = curry(2, (x, y) => {
//   return x + y
// })

// console.log(f(1, 2))
// console.log(f(2)(3))

let f = compose(toUpper, first)
const arr = ['lynn', 'zs', 'lodash']
console.log(f(arr));