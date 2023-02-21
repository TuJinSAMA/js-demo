const s = new Set(['foo', 'bar', 'baz'])

for (const item of s) {
  console.log(item);
}

const obj = {
  name: 'zs',
  age: 18
}

for (const [key, value] of Object.entries(obj)) {
  console.log(key, value)
}


// const todoObj = {
//   life: ['吃饭', '睡觉', '打豆豆'],
//   learn: ['语文', '数学', '英语'],
//   sport: ['篮球', '羽毛球', '足球'],
//   [Symbol.iterator]: function () {
//     let index = 0
//     return {
//       next:  () => {
//         const all = [].concat(this.life, this.learn, this.sport)
//         return {
//           value: all[index],
//           done: index ++ >= all.length
//         }
//       }
//     }
//   }
// }


const todoObj = {
  life: ['吃饭', '睡觉', '打豆豆'],
  learn: ['语文', '数学', '英语'],
  sport: ['篮球', '羽毛球', '足球'],
  [Symbol.iterator]: function* () {
    const all = [...this.life, ...this.learn, ...this.sport]
    for (const item of all) {
      yield item
    }
  }
}


for (const item of todoObj) {
  console.log(item)
}