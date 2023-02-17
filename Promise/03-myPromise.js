const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

export default class MyPromise {
  constructor(executor) {
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }
  status = PENDING
  value = undefined
  reason = undefined
  successCallBackList = []
  failCallBackList = []

  resolve = value => {
    if (this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    while (this.successCallBackList.length) this.successCallBackList.shift()(this.value)
  }

  reject = reason => {
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    while (this.failCallBackList.length) this.failCallBackList.shift()(this.reason)
  }

  then(successCallBack, failCallBack) {
    successCallBack = typeof successCallBack === 'function' ? successCallBack : (value => value)
    failCallBack = typeof failCallBack === 'function' ? failCallBack : (reason => reason)
    let backPromise = new MyPromise((resolve, reject) => {
      switch (this.status) {
        case FULFILLED:
          queueMicrotask(() => {
            try {
              parsePromise(backPromise, successCallBack(this.value), resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
          break;
        case REJECTED:
          queueMicrotask(() => {
            try {
              parsePromise(backPromise, failCallBack(this.reason), resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
          break;
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
}

function parsePromise(promise, result, resolve, reject) {
  if (promise === result) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  if (result instanceof MyPromise) {
    return result.then(resolve, reject)
  } else {
    return resolve(result)
  }
}