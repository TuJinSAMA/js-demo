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
    successCallBack = typeof successCallBack === 'function' ? successCallBack : (value => value)
    failCallBack = typeof failCallBack === 'function' ? failCallBack : (reason => { throw reason })
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

  catch(callBack) {
    // catch 是用来注册 promise 拒绝时的回调函数
    // 返回一个 promise 对象 其实就是 .then的简写
    return this.then(undefined, callBack)
  }

  finally(callBack) {
    // finally 注册一个 promise 状态不论是 fulfilled 或 rejected 都会执行的回调
    // 返回一个 promise ,并且返回的是前面 promise 的值
    // 例如 Promise.reject(3).finally(() => {}) ---3
    // Promise.resolve(2).finally(() => {}) ---2
    if (typeof callBack !== 'function') throw new TypeError('the param must be a function!')
    return this.then(value => {
      return RPromise.resolve(callBack()).then(() => value)
    }, reason => {
      return RPromise.reject(callBack()).then(undefined, () => { throw reason })
    })
  }

  static resolve(value) {
    // 接收一个普通值 或 一个 promise
    // 如果是普通值则返回一个成功状态的 promise 如果是 promise 则返回传入的 promise
    if (value instanceof RPromise) return value
    return new RPromise(resolve => resolve(value))
  }

  static reject(reason) {
    // 返回一个给定了拒绝原因的 promise 
    return new RPromise((resolve, reject) => reject(reason))
  }

  static all(promises) {
    // 接收一个数组 数组内的值可以是普通值也可以是 promise
    // 返回一个 promise 只有数组内的 promise 状态都变为成功时 返回的 promise 的状态才会变为成功
    // promise 的结果也是数组 存放着传入数组内 promise 的返回结果 位置不按返回结果先后 而是按照传入数组的顺序
    if (!Array.isArray(promises)) return
    let _results = [];
    let _count = 0;
    return new RPromise((resolve, reject) => {
      try {
        const addData = (key, value) => {
          _results[key] = value;
          (++_count >= promises.length) && resolve(_results)
        }
        promises.forEach((item, index) => {
          if (item instanceof RPromise) {
            item.then(value => addData(index, value), reject)
          } else {
            addData(index, item)
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  static race(promises) {
    // 接收一个数组 数组内的值可以是普通值也可以是 promise
    // 返回一个 promise 数组内的 promise 哪个先改变状态 就返回这个 promise 的结果
    if (!Array.isArray(promises)) return
    return new RPromise((resolve, reject) => {
      try {
        promises.forEach((item, index) => {
          if (item instanceof RPromise) {
            item.then(resolve, reject)
          } else {
            resolve(item)
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}