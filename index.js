import RPromise from "./Promise/04-reviewPromise";

// 测试最基本的链式调用、then 中返回 promise 的情况和异步
// let p =new RPromise((resolve, reject) => {
//   // resolve(1)
//   // reject(1)
//   setTimeout(() => {
//     resolve(1)
//     // reject(1)
//   }, 2000);
// }).then(res => {
//   console.log('success: ', res);
//   return new RPromise((resolve, reject) => {
//     // resolve(2)
//     // reject(2)
//     setTimeout(() => {
//       // resolve(2)
//       reject(2)
//     }, 2000);
//   })
// }, err => {
//   console.log('fail: ', err)
// }).then(res => {
//   console.log('success1: ', res);
// }, err => {
//   console.log('fail1: ', err)
// })

// 测试 then 方法不传入回调是否继续向下传递
// let p =new RPromise((resolve, reject) => {
//   // resolve(1)
//   reject(1)
// }).then().then().then(res => {
//   console.log('success: ', res);
// }, err => {
//   console.log('fail: ', err)
// })

// 测试 catch
// let p =new RPromise((resolve, reject) => {
//   resolve(1)
//   // reject(1)
// }).then(res => {
//   console.log('success: ', res);
//   return new RPromise((resolve, reject) => {
//     reject('err')
//   })
// }).catch(err => {
//   console.log('catch', err)
// })


// 测试 finally
// let p = new RPromise((resolve, reject) => {
//   resolve('success')
//   // reject('err')
// }).then(value => {
//   console.log('then', value);
//   return new RPromise((resolve, reject) => {
//     resolve('then res')
//     // reject('then err')
//   })
// }).finally((value) => {
//   console.log('finally', value)
// })
// console.log(p);


// 测试 Promise.resolve
// let pp = new RPromise((resolve, reject) => {
//   // reject('error')
//   resolve(111)
// })
// let p = RPromise.resolve(1).then(res => {
//   console.log('success: ', res);
// }).catch(err => {
//   console.log('catch:', err)
// })
// console.log(p);

// 测试 Promise.reject
// let p = RPromise.reject(1).then(res => {
//   console.log('success: ', res);
// }).catch(err => {
//   console.log('catch:', err)
// })
// console.log(p);