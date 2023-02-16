import axios from "axios";

function* gen() {
  const { data } = yield axios.get("/json/url.json")
  console.log(data.user)

}

let g = gen()

g.next().value.then(value => {
  g.next(value)
})