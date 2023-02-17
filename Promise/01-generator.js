import axios from "axios";
import HsPromise from './02-HsPromise'
import MyPromise from './03-myPromise'

// function* gen() {
//   const { data } = yield axios.get("/json/url.json")
//   console.log(data)
//   const result = yield axios.get(data.user)
//   console.log(result.data)

// }

// function run(generator) {
//   const _g = generator()

//   function next(data) {
//     let _result = _g.next(data)
//     if (_result.done) return _result.value
//     _result.value.then(res => {
//       return next(res)
//     })
//   }
//   return next()
// }

// run(gen)

// temp
let promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    // resolve('async success')
    reject('async fail')
  }, 2000)
  // throw new Error('executor error')
  // resolve('success')
  // reject('fail')
})

// promise.then(result => {
//   console.log(result)
//   return new MyPromise((resolve, reject) => {
//     resolve('promise 100')
//   })
// }, reason => {
//   console.log(reason);
// }).then(res => {
//   console.log(res);
// })

promise.then().then().then(res => {
  console.log(res);
}, err => {
  console.log(err)
})

// console.log('test')


// promise.then(result => {
//   console.log(2)
//   console.log(result)
// })

// promise.then(result => {
//   console.log(3)
//   console.log(result)
// })


let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('fff')
  }, 0);
}).then().then().then(res => {
  console.log('1')
  console.log(res);
}, err => {
  console.log('2');
  console.log(err)
})

console.log(p);