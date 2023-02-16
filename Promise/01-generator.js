import axios from "axios";

function* gen() {
  const { data } = yield axios.get("/json/url.json")
  console.log(data)
  const result = yield axios.get(data.user)
  console.log(result.data)

}

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