/**
 * 谈谈你是如何理解JS异步编程的
 * EventLoop、消息队列都是做什么的
 * 什么是宏任务，什么是微任务?
 */

/**
 * JS异步编程的出现是因为在浏览器环境中，JS脚本是用一个单独的线程处理的，并不支持多线程
 * 但实际的情况就是，如果只有同步编程，那进行大量计算或需要长时间才有响应结果的操作时，就会发生阻塞
 * 使用异步编程的方式可以避免发生这种情况
 * 
 * EventLoop 是JS的事件循环机制，简单理解就是JS在处理事件上的一套规则，
 * JS代码是从上往下依次执行的，在主执行栈执行完同步代码时，就会先去微任务队列查看是否有微任务，
 * 如果有则拿出执行，如果没有待执行的微任务就去查看宏任务队列是否有宏任务，
 * 如果有则拿出来执行，如果没有可以理解这一轮事件循环结束，可以进行下一轮事件循环。
 * 
 * 宏任务是指 setTimeout, setInterval 这些
 * 微任务是指 promise, queueMicrotask 这些
 */

//  ### 一、将下面异步代码使用 Promise 的方式改进

//  ```
//  setTimeout(function() {
//      var a = 'hello'
//      setTimeout(function() {
//          var b = 'lagou'
//          setTimeout(function() {
//              var c = 'I ❤️ U'
//              console.log(a + b + c)
//          }, 10);
//      }, 10);
//  }, 10);
//  ```

// Promise.resolve().then(() => {
//   return Promise.resolve('hello')
// }).then(a => {
//   return Promise.resolve(a + 'lagou')
// }).then((b) => {
//   const c = 'I ❤️ U'
//   console.log(b + c)
// })


// 二、基于以下代码完成下面的四个练习
const fp = require('lodash/fp')
// 数据：horsepower 马力，dollar_value 价格，in_stock 库存
const cars = [
    { name: 'Ferrari FF', horsepower: 660, dollar_value: 700000, in_stock: true },
    { name: 'Spyker C12 Zagato', horsepower: 650, dollar_value: 648000, in_stock: false },
    { name: 'Jaguar XKR-S', horsepower: 550, dollar_value: 132000, in_stock: false },
    { name: 'Audi R8', horsepower: 525, dollar_value: 114200, in_stock: false },
    { name: 'Aston Martin One-77', horsepower: 750, dollar_value: 1850000, in_stock: true },
    { name: 'Pagani Huayra', horsepower: 700, dollar_value: 1300000, in_stock: false }
]
// 练习1：使用组合函数 fp.flowRight() 重新实现下面这个函数
// let isLastInStock = function(cars){
//     获取最后一条数据
//     let last_car = fp.last(cars)
//     获取最后一条数据的 in_stock 属性值
//     return fp.prop('in_stock', last_car)
// }
// 先定义获取最后一条数据的函数，再定义获取某个对象中的 in_stock 属性的函数，再用 fp.flowRight 组合函数
const f1 = fp.flowRight(fp.prop('in_stock'), fp.last)
console.log(f1(cars));

// 练习2：使用 fp.flowRight()、fp.prop() 和 fp.first() 获取第一个 car 的 name
// 先定义获取第一条数据的函数，再定义获取某个对象中的 name 属性的函数，再用 fp.flowRight 组合函数
const f2 = fp.flowRight(fp.prop('name'), fp.first)
console.log(f2(cars));

// 练习3：使用帮助函数 _average 重构 averageDollarValue, 使用函数组合的方式实现
let _average = function(xs){
    return fp.reduce(fp.add, 0, xs) / xs.length
}
// 先定义获取某个对象中的 dollar_value 属性的函数，将该函数作为 fp.map 的数组元素处理函数，再用 fp.flowRight 组合函数
const f3 = fp.flowRight(_average, fp.map(fp.prop('dollar_value')))
console.log(f3(cars))

// 练习4：使用 flowRight 写一个 sanitizeNames() 函数，返回一个下划线连续的小写字符串，把数组中的 name 转换为这种形式，例如：sanitizeNames(["Hello World"]) => ["hello_world"]
let _underscore = fp.replace(/\W+/g, '_') // 无须改动，并在 sanitizeNames 中使用它
// 先定义获取某个对象中的 name 属性的函数，再定义转化为小写的函数，再将空格和下划线替换，,再用 fp.flowRight 组合函数
const sanitizeNames = fp.map(fp.flowRight(fp.toLower, _underscore))
const f4 = fp.flowRight(sanitizeNames, fp.map(fp.prop('name')))
console.log(f4(cars));