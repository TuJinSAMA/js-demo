const _ = require('lodash')
const fp = require('lodash/fp')

const arr = [23, 8, 10]

console.log(_.map(arr, parseInt));
// [23, NaN, 2]
// 解析：
// map(fn) 中 传入的回调函数 实际会传入三个实参 (item, index, array)
// parseInt 方法本身接收 2 个形参 string 和 radix
// radix 参数默认值是 0 可选值是 2 ~ 36 之间的数 用于设置解析字符串的基数为几进制
// 所以实际调用的则是:
// [23, 8, 10].map(function (item, index, array) {
//   return parseInt(item, index, array)
// })

console.log(fp.map(parseInt)(arr));
// [23, 8, 10]

const str = 'world sild deb'

const f = fp.flowRight(fp.map(fp.flowRight(fp.toUpper)), fp.split(' '))

console.log(f(str));