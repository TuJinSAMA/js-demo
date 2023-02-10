const m = require('./02-curry')
const c = require('./03-compose')
const d = require('./05-compose-debug')
// 程序的本质就是 通过 输入 得到 输出
// 个人理解 PointFree 是函数式编程最佳实践的解释
// 将多个函数组合在一起 组成一种运算逻辑 但是与具体进行运算的值无关
// 这么说可能有点抽象 简单理解就是 只组合运算方式 而不关心值
// 比如我有一个组合函数 它会把得到的参数先加再乘再减 我们只关心这其中的运算顺序 和 进行了什么运算 (可以想象成拼接管道)
// 但我们不会关心这个值具体是多少 (我们只关心管道怎么拼接 会进行什么样的运算 不关心值是多少)
// 举个例子 我想得到这个字符串里最长的单词长度是多少
const str = 'Lorem ipsum dolor sit amet consectetur adipiscing elit';

// 我们可以先定义几个纯函数

const split = m.curry((sep, str) => str.split(sep))

const map = m.curry((fn, arr) => arr.map(fn))

const getLength = s => s.length

const getBiggerNumber = (a, b) => a > b ? a : b

const reduce = m.curry((fn, val, arr) => arr.reduce(fn, val))

// 最后我们来组合一个函数 用来得到一个字符串里最长的单词长度
const f = c.compose(
  reduce(getBiggerNumber, 0),
  map(getLength),
  split(' ')
)

// 调用测试一下
console.log(f(str))
// 11