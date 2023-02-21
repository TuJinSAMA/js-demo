const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

export default class MyPromise {
  // 构造函数接收一个函数作为执行器 执行器函数的实参为实例方法 resolve, reject
  constructor(executor) {
    try {
      // 调用执行器函数
      executor(this.resolve, this.reject)
    } catch (error) {
      // 捕获执行器函数的错误
      this.reject(error)
    }
  }
  status = PENDING
  value = undefined
  reason = undefined
  successCallBackList = []
  failCallBackList = []

  resolve = value => {
    // 如果 promise 的状态已经变更 则返回 ( promise 状态的不可变性)
    if (this.status !== PENDING) return
    // 更改 promise 状态为成功
    this.status = FULFILLED
    // 缓存数据
    this.value = value
    // 执行回调队列
    while (this.successCallBackList.length) this.successCallBackList.shift()(this.value)
  }

  reject = reason => {
    // 如果 promise 的状态已经变更 则返回 ( promise 状态的不可变性)
    if (this.status !== PENDING) return
    // 更改 promise 状态为失败
    this.status = REJECTED
    // 缓存失败原因
    this.reason = reason
    // 执行回调队列
    while (this.failCallBackList.length) this.failCallBackList.shift()(this.reason)
  }

  // then 方法 接收两个函数 一个是 promise 成功的回调 一个是 promise 失败的回调
  then(successCallBack, failCallBack) {
    // promise 链式调用的传递 
    // promise.then().then().then(res => console.log(res)) 如果then方法中不传入参数 promise 的参数也会一直传递
    successCallBack = typeof successCallBack === 'function' ? successCallBack : (value => value)
    failCallBack = typeof failCallBack === 'function' ? failCallBack : (reason => { throw reason })
    // then 方法返回一个 promise 实现链式调用
    let backPromise = new MyPromise((resolve, reject) => {
      // 判断 promise 的状态
      switch (this.status) {
        // 状态为成功 则直接调用成功的回调函数并判断返回值
        case FULFILLED:
          queueMicrotask(() => {
            try {
              parsePromise(backPromise, successCallBack(this.value), resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
          break;
        // 状态为失败 则直接调用失败的回调函数并判断返回值
        case REJECTED:
          queueMicrotask(() => {
            try {
              parsePromise(backPromise, failCallBack(this.reason), resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
          break;
        // 状态为等待 则把回调函数加入队列 等待执行
        case PENDING:
          this.successCallBackList.push(() => {
            queueMicrotask(() => {
              try {
                parsePromise(backPromise, successCallBack(this.value), resolve, reject)
              } catch (error) {
                reject(error)                
              }
            })
          })
          this.failCallBackList.push(() => {
            queueMicrotask(() => {
              try {
                parsePromise(backPromise, failCallBack(this.reason), resolve, reject)
              } catch (error) {
                reject(error)                
              }
            })
          })
          break;

        default:
          break;
      }
    })
    return backPromise
  }

  // 因为调用者一定是一个 promise 则直接调用它的 then 方法 将回调函数传到第二个参数里 失败会自动调用
  catch(failCallBack) {
    return this.then(undefined, failCallBack)
  }

  // 不论 promise 的状态为成功还是失败 只要状态改变了 都会调用
  // 需要注意的是 finally 返回一个 promise 可以继续链式调用 并且会传递 finally 之前的 promise 成功的参数
  finally(callback) {
    if (typeof callback !== 'function') throw new TypeError('the param type must be a function')
    return this.then(value => {
      return MyPromise.resolve(callback()).then(() => value)
    }, reason => {
      return MyPromise.reject(callback()).then(undefined, ()=>{throw reason})
    })
  }

  // 如果参数是 promise 则直接返回它本身
  // 如果参数是普通值，则返回一个新的状态为 fulfilled 的 promise
  static resolve(value) {
    if(value instanceof MyPromise) return value
    return new MyPromise(resolve => resolve(value))
  }

  // 返回一个状态为 rejected 的 promise 
  static reject(value) {
    return new MyPromise((resolve, reject) => {
      return reject(value)
    })
  }
  
  // 执行多个 promise
  // 所有 promise 都成功才 resolve, 否则是 reject
  // 返回的结果是一个数组 顺序是按照传入的 promise 的顺序 而不是按调用后返回的顺序排序
  static all(array) {
    let _results = []
    let _count = 0
    return new MyPromise((resolve, reject) => {
      const addData = (index, value) => {
        _results[index] = value
        _count++
        if (_count === array.length) {
          resolve(_results)
        }
      }
      array.forEach((item, index) => {
        if (item instanceof MyPromise) {
          item.then(value => addData(index, value), reason => reject(reason))
        } else {
          addData(index, item)
        }
      })
    })
  }

  // 执行多个 promise 返回最先改变状态的那个 promise
  // 如果传入的数组中有普通值 则会直接返回 成功状态的 promise
  static race(array) {
    return new MyPromise((resolve, reject) => {
      array.forEach((item) => {
        if (item instanceof MyPromise) {
          item.then(value => resolve(value), reason => reject(reason))
        } else {
          resolve(item)
        }
      })
    })
  }
}

function parsePromise(promise, result, resolve, reject) {
  // 回调函数不可以返回自己本身
  if (promise === result) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  // 如果回调函数返回的是一个 promise 则执行它的then方法
  // 并且传入 resolve reject
  if (result instanceof MyPromise) {
    return result.then(resolve, reject)
  } else {
    // 如果是普通值则直接返回
    return resolve(result)
  }
}