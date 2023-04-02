import axios from "axios";
import HsPromise from './02-HsPromise'
import MyPromise from './03-myPromise'

function* gen() {
  const { data } = yield axios.get("/json/url.json")
  console.log(data)
  const result = yield axios.get(data.user)
  console.log(result.data)
}

// function* gen() {
//   yield "hello"
//   yield "generator"
//   return "ok"
// }

function run(generator) {
  const _g = generator()

  function next(data) {
    let _result = _g.next(data)
    if (_result.done) return _result.value
    _result.value.then(res => {
      return next(res)
    })
  }
  return next()
}

run(gen)

// temp
// let promise = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('async success')
    // reject('async fail')
  // }, 2000)
  // throw new Error('executor error')
  // resolve('success')
  // reject('fail')
// })

// promise.then((res) => {
//   console.log(res);
//   return new MyPromise((resolve, reject) => { 
//     setTimeout(() => {
//       resolve('async 11')
//       // reject('async fail')
//     }, 2000)
//   })
// }).then(res => {
//   console.log(res)
// })

// p.then(undefined, err => console.log(err))

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

// promise.then().then().then(res => {
//   console.log(res);
// }, err => {
//   console.log(err)
// })

// console.log('test')


// promise.then(result => {
//   console.log(2)
//   console.log(result)
// })

// promise.then(result => {
//   console.log(3)
//   console.log(result)
// })

// const p1 = () => {
//   return new MyPromise((resolve, reject) => { 
//     resolve('p1 resolve')
//     // reject('p1 reject')
//   })
// }

// const p2 = () => {
//   return new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//       // resolve('p2 resolve')
//       reject('p2 reject')
//     }, 1000);
//   })
// }

// p1().finally(() => {
//   console.log('finally')
//   return p2()
// }).then(result => {
//   console.log('1');
//   console.log(result);
// }, err => {
//   console.log('2')
//   console.log(err)
// })

// MyPromise.all([p2(), p1()]).then(result => {
//   console.log(result);
// }, err => {
//   console.log(err)
// })

// p2().then(result => {
//   console.log(result);
// }).catch(err => {
//   console.log('err');
//   console.log(err);
// })

// MyPromise.race([p2(),'2', p1()]).then(res => {
//   console.log('res', res)
// }).catch(err => {
//   console.log('err', err);
// })