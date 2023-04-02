import axios from 'axios'

// axios.get("/json/url.json").then(({ data }) => {
//   return axios.get(data.user)
// }).then(({ data }) => {
//   console.log(data)
// })


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

// async function getData() {
//   const { data } = await axios.get("/json/url.json")
//   console.log(data)
//   const result = await axios.get(data.user)
//   console.log(result.data)
// }

function getData() {
  return spawn(function* () {
    const { data } = yield axios.get("/json/url.json")
    console.log(data)
    const result = yield axios.get(data.user)
    console.log(result.data)
  })
}

function spawn(genF) {
  return new Promise((resolve, reject) => {
    const gen = genF();
    function step(nextF) {
      let next;
      try {
        next = nextF(gen)
      } catch (error) {
        return reject(error)
      }
      if (next.done) {
        return resolve(next.value)
      }
      Promise.resolve(next.value).then(function (result) {
        step(function () { return gen.next(result) })
      }, function (err) {
        step(function() {return gen.throw(err)})
      })
    }
    step(function () { return gen.next(undefined) })
  })
}

getData()