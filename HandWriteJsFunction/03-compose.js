// compose 组合函数 
// 将接收的函数按从右到左的顺序执行 一个函数的返回值作为下一个函数的参数
// es5
const compose = function () {
  const args = [].slice.apply(arguments)
  return function (value) { 
    let _result = value
    for (let i = args.length - 1; i >= 0; i--) {
      _result = args[i](_result)
    }
    return _result
  }
}

// es6 flowRight
const flowRight = (...args) => value => args.reduceRight((res, fn)=> fn(res), value)

const reverse = arr => arr.reverse()

const first = arr => arr[0]

const toUpper = s => s.toUpperCase()

const f = flowRight(toUpper, first, reverse)

const arr = ['andy', 'bob', 'lynn']
console.log(f(arr))