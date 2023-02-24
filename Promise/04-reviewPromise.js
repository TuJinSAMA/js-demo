// 创建 promise 状态的常量
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

// promise 公用解析函数
// 为了解析回调调用过后的返回值是普通值还是 promise, 做不同处理
const parsePromise = (promise, result, resolve, reject) => {
  // 如果调用后返回回调函数本身 则抛出错误
  if (promise === result) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  if (result instanceof RPromise) {
    // 如果是 promise 则返回并调用它的 then 方法
    return result.then(resolve, reject)
  } else {
    // 如果是普通值则直接返回 状态默认是成功的
    return resolve(result)
  }
}

export default class RPromise {
  constructor(executor) {
    // 在 new Promise 的时候传入一个函数 我们把这个函数叫做执行器
    // 在构造函数中要调用这个执行器 并且传入实例方法 resolve 和 reject
    // 并且做好执行器的错误捕获
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  status = PENDING
  value = undefined
  reason = undefined
  successCallBackList = []
  failCallBackList = []

  // 使用箭头函数是为了绑定 this
  resolve = value => {
    // promise 不可变性
    if (this.status !== PENDING) return
    // 改变 promise 状态 保存value
    this.status = FULFILLED
    this.value = value

    // resolve 的调用时机可能是异步 所以当队列中有待执行的函数时 则执行
    while (this.successCallBackList.length) this.successCallBackList.shift()(this.value)
  }

  // 使用箭头函数是为了绑定 this
  reject = reason => {
    // promise 不可变性
    if (this.status !== PENDING) return;
    // 改变 promise 状态 保存value
    this.status = REJECTED
    this.reason = reason

    // reject 的调用时机可能是异步 所以当队列中有待执行的函数时 则执行
    while (this.failCallBackList.length) this.failCallBackList.shift()(this.reason)
  }

  then(successCallBack, failCallBack) {
    // 调用 then 方法时如果不传入回调 则默认继续向下传递
    successCallBack = typeof successCallBack === 'function' ? successCallBack : value => value
    failCallBack = typeof failCallBack === 'function' ? failCallBack : reason => { throw reason }
    // 接收两个参数 一个成功的回调 一个失败的回调
    let _promise = new RPromise((resolve, reject) => {
      // 因为调用 resolve 或 reject 可能是同步也可能是异步 所以这里需要判断 status
      switch (this.status) {
        case FULFILLED:
          // 如果调用 then 的时候 promise 的状态已经被改变则直接创建微任务
          queueMicrotask(() => {
            try {
              parsePromise(_promise, successCallBack(this.value), resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
          break;
        case REJECTED:
          // 如果调用 then 的时候 promise 的状态已经被改变则直接创建微任务
          queueMicrotask(() => {
            try {
              parsePromise(_promise, failCallBack(this.reason), resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
          break;
        case PENDING:
          // 如果调用 then 的时候 promise 的状态还没改变 则说明是异步 Promise
          // 将回调函数缓存延迟执行
          this.successCallBackList.push(() => {
            queueMicrotask(() => {
              try {
                parsePromise(_promise, successCallBack(this.value), resolve, reject)
              } catch (error) {
                reject(error)
              }
            })
          })
          this.failCallBackList.push(() => {
            queueMicrotask(() => {
              try {
                parsePromise(_promise, failCallBack(this.reason), resolve, reject)
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
    // 返回一个 promise 以供链式调用
    return _promise
  }
}