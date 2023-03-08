for (let i = 0; i < 3; i++) {
  const btn = document.createElement("button")
  btn.textContent = `button${i + 1}`
  document.body.appendChild(btn)
}
var buttons = document.querySelectorAll('button')

for (var i = 0; i < buttons.length; i++) {
  (function (i) {
    buttons[i].onclick = function () {
      console.log(i)
    }
  })(i)
}

buttons = null
console.log(buttons)