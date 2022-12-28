import random from "random"

const words = [
  "らせん階段",
  "カブト虫",
  "廃墟の街",
  "イチジクのタルト",
  "カブト虫",
  "ドロローサへの道",
  "カブト虫",
  "特異点",
  "ジョット",
  "エンジェル",
  "紫陽花",
  "カブト虫",
  "特異点",
  "秘密の皇帝"
]

const vw = Math.max(document.documentElement.vw || 0, window.innerWidth || 0)
const vh = Math.max(document.documentElement.vh || 0, window.innerHeight || 0)

let lastPosition = null
const Position = {
  leftTop: Symbol(),
  leftBottom: Symbol(),
  rightTop: Symbol(),
  rightBottom: Symbol(),
}

const sleep = t => new Promise(resolve => setTimeout(resolve, t))

const domList = []
const getWordDom = (w, x, y, isLast) => {
  const dom = document.createElement("div")
  dom.classList.add("__pucci_14_word")
  dom.textContent = w
  dom.style.left = `${Math.round(x)}px`
  dom.style.top = `${Math.round(y)}px`
  domList.push(dom)

  if(isLast) {
    dom.classList.add("__pucci_14_word_last")
  }

  setTimeout(() => {
    dom.classList.add(isLast ? "__pucci_14_word_last_finaly" : "__pucci_14_word_leave")
  }, 233)

  return dom
}

const cleanDom = () => {
  domList.forEach(d => d.remove())
}

const getStyle = () => {
  const dom = document.createElement("link")
  dom.rel = "stylesheet"
  dom.href = chrome.runtime.getURL("style/index.css")
  return dom
}

const getRandomPosition = (position=null) => {
  position = Object.values(Position).filter(p => p !== position)
  return position[Math.floor(Math.random() * position.length)]
}

;(async () => {
  const style = getStyle()
  document.head.appendChild(style)

  for (const i in words) {
    const word = words[i]
    const border = 250
    lastPosition = getRandomPosition(lastPosition)
    let x = 1, y = 1
    debugger
    switch (lastPosition) {
      case Position.leftTop:
        x = random.float(border, vw / 2)
        y = random.float(border, vh / 2)
        break
      case Position.leftBottom:
        x = random.float(border, vw / 2)
        y = random.float(vh / 2, vh - border)
        break
      case Position.rightTop:
        x = random.float(vw / 2, vw - border)
        y = random.float(border, vh / 2)
        break
      case Position.rightBottom:
        x = random.float(vw / 2, vw - border)
        y = random.float(vh / 2, vh - border)
        break
    }

    document.body.appendChild(getWordDom(word, x, y, +i === words.length - 1))
    await sleep(757)
  }

  await sleep(5000)
  cleanDom()
  style.remove()
})()