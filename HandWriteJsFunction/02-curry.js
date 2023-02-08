var _ = require('lodash')
/**
 * 柯里化函数 将多个参数的函数进行柯里化 
 * @param {*} fn 接收一个有多个参数的纯函数
 * @returns 返回柯里化后的函数 调用时如果实参长度小于原函数形参长度将继续返回接收剩余参数的函数 直到参数长度相等才会执行原函数
 */

const curry = function (fn) {
  return function curried (...args) {
    if (args.length < fn.length) {
      return (...a) => curried(...args.concat(Array.from(a)))
    }
    return fn(...args)
  }
}

const sum = (a, b, c) => a + b + c
const mySplit = (str, sep) => str.split(sep)

const curried = curry((sep, str) => mySplit(str, sep))

// test
// console.log(curried(1, 2, 3))
// console.log(curried(1)(2, 3))
// console.log(curried(1)(2)(3))
// console.log(curried(' ', 'NEVER SAY DIE'));

module.exports = {
  curry
}