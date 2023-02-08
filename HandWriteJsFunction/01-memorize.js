/**
 * 缓存函数 能够将函数的计算结果进行缓存
 * @param {*} fn 接收一个纯函数
 * @returns 返回一个缓存函数 多次调用该函数并且参数相同 则只会调用原函数一次
 */
const memorize = function (fn) {
  let cache = {}
  return function (key) {
    cache[key] = cache[key] || fn.apply(fn, arguments)
    return cache[key]
  }
}

const getArea = function (r) {
  console.log(r)
  return Math.PI * r * r
}

const getAreaWithMemory = memorize(getArea)

// test
console.log(getAreaWithMemory(4));
console.log(getAreaWithMemory(4));
console.log(getAreaWithMemory(4));