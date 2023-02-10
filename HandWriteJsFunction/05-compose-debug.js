const m = require('./02-curry')
// es6 flowRight
const flowRight = (...args) => value => args.reduceRight((res, fn)=> fn(res), value)

const reverse = arr => arr.reverse()

const first = arr => arr[0]

const toUpper = s => s.toUpperCase()

//debug
const trace = m.curry((tag, v) => {
  console.log(tag, v);
  return v
})


const f = flowRight(toUpper, trace('first之后'), first, trace('reverse之后'), reverse)

const arr = ['andy', 'bob', 'lynn']
// console.log(f(arr))

module.exports = {
  trace
}