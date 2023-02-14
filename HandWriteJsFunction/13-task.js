// 演示 folktale 库中的 task 函子
const fs = require('fs')
const { task } = require('folktale/concurrency/task')
const { split, find } = require('lodash/fp')

function readFile(filename) {
  return task(resolver => {
    fs.readFile(filename, 'utf-8', (err, data) => {
      if (err) return resolver.reject(err)

      resolver.resolve(data)
    })
  })
}

// test
readFile('../package.json')
  .map(split('\n'))
  .map(find(x => x.includes('version')))
  .run()
  .listen({
    onResolved: data => {
      console.log(data);
    },
    onRejected: err => {
      console.log(err)
    }
  })
