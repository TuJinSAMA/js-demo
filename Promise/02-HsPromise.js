export default class HsPromise {
  // 用静态属性声明promise的状态, 只能在类中调用
  static PENDING = "pending"
  static FULFILLED = "fulfilled"
  static REJECTED = "rejected"

  /**
   *
   * @param {Function} executor 传入的回调
   */
  constructor(executor) {
    // 声明promise的状态
    this.status = HsPromise.PENDING
    // 声明value，用来接收执行之后的结果
    this.value = null
    // 等待执行的函数队列
    this.callbacks = []
    // 2. 为了捕获在promise的函数体内发生错误，此时应该直接reject，
    try {
      // 1. 所以在执行的时候，需要手动绑定一下this 到类当中
      // executor(this.resolve, this.reject)
      executor(this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      this.reject(error)
    }
  }

  /**
   * promise执行成功的方法
   * @param {*} value 成功后的结果
   */
  resolve(value) {
    // console.log(this)
    // 1. 此处的this是在html文件里面调用resolve的时候确定的，指向了window
    // 但是由于类中默认启用严格模式，所以会报错this为 undefined
    if (this.status !== HsPromise.PENDING) return // 实现promise中状态只能被改变一次
    this.status = HsPromise.FULFILLED
    this.value = value

    setTimeout(() => {
      // 5. 调用改变状态的时候，去执行排队的函数
      this.callbacks.map(callback => {
        callback.onFulfilled(value)
      })
    })
  }
  /**
   * promise执行失败的方法
   * @param {*} reason 失败原因
   */
  reject(reason) {
    if (this.status !== HsPromise.PENDING) return // 实现promise中状态只能被改变一次
    this.status = HsPromise.REJECTED
    this.value = reason

    setTimeout(() => {
      this.callbacks.map(callback => {
        callback.onRejected(reason)
      })
    })
  }

  /**
   * promise状态改变后的回调
   * @param {function} onFulfilled pending -> fulfilled 的回调函数
   * @param {function} onRejected pending -> rejected 的回调函数
   * @returns 新的Promise
   */
  then(onFulfilled, onRejected) {
    // 7 如果在调用then的时候，不传入参数，可以将值正常传递到后一个then中
    if (typeof onFulfilled !== "function") onFulfilled = () => this.value
    if (typeof onRejected !== "function") onRejected = () => this.value

    // 6 完成then链式调用的的逻辑，返回一个新的promise
    let promise = new HsPromise((resolve, reject) => {
      // 5 如果外面的代码是异步的，promise的状态就是pending ，所以还需要处理
      if (this.status === HsPromise.PENDING) {
        // 将函数传入callbacks队列
        this.callbacks.push({
          onFulfilled: value => {
            this.parse(promise, onFulfilled(value), resolve, reject)
          },
          onRejected: reason => {
            this.parse(promise, onRejected(reason), resolve, reject)
          },
        })
      }

      // 3 .then不是立即执行的，而是在状态改变之后执行，所以需要加上状态的判断
      if (this.status === HsPromise.FULFILLED) {
        // 4. setTimeout是为了将then的执行变成异步执行
        setTimeout(() => {
          // 9 抽离重复代码
          this.parse(promise, onFulfilled(this.value), resolve, reject)

          // try {
          //   const result = onFulfilled(this.value)

          // 8. 如果在then里面return 一个新的promise的处理
          //   if (result instanceof HsPromise) {
          // 8. 如果是一个promise 返回状态改变后的结果值，而不是返回promise
          // result.then(
          //   value => resolve(value),
          //   reason => reject(reason)
          // )
          // 简化
          //     result.then(resolve, reject)
          //   } else {
          // 8. 如果是普通值 直接返回
          //     resolve(result)
          //   }
          // } catch (error) {
          //   reject(error)
          // }
        })
      }

      if (this.status === HsPromise.REJECTED) {
        setTimeout(() => {
          this.parse(promise, onRejected(this.value), resolve, reject)
        })
      }
    })

    return promise
  }

  /**
   * 抽离的冗余重复代码
   * @param {*} promise 当前then 返回的promise
   * @param {*} result 当前函数
   * @param {*} resolve pending -> fulfilled 的回调函数
   * @param {*} reject pending -> rejected 的回调函数
   */
  parse(promise, result, resolve, reject) {
    // 10. promise.then中不允许return 自己
    if (promise === result) {
      throw new TypeError("不允许在then中直接返回自己")
    }
    try {
      // const result = onRejected(this.value)
      // .then返回的新promise默认是resolve的，所以此处还是调用resolve

      if (result instanceof HsPromise) {
        result.then(resolve, reject)
      } else {
        resolve(result)
      }
    } catch (error) {
      reject(error)
    }
  }

  static resolve(value) {
    return new HsPromise((resolve, reject) => {
      if (value instanceof HsPromise) {
        value.then(resolve, reject)
      } else {
        resolve(value)
      }
    })
  }

  static reject(value) {
    return new HsPromise((resolve, reject) => {
      if (result instanceof HsPromise) {
        value.then(resolve, reject)
      } else {
        reject(value)
      }
    })
  }
}
