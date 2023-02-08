// pip 组合函数 
// 将接收的函数按从左到右的顺序执行 一个函数的返回值作为下一个函数的参数
// es5
const pipe = function () {
  const args = [].slice.apply(arguments)
  return function (value) { 
    let _result = value
    for (let i = 0; i < args.length; i++) {
      _result = args[i](_result)
    }
    return _result
  }
}

// es6 flow
const flow = (...args) => value => args.reduce((res, fn)=> fn(res), value)

const reverse = arr => arr.reverse()

const first = arr => arr[0]

const toUpper = s => s.toUpperCase()

const f = pipe(reverse, first, toUpper)

const arr = ['lynn','andy', 'bob']
console.log(f(arr))