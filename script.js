let timeInterval
let timeStand
let source
let firstTime = true
let pId = 1

const __audio = document.getElementById('audio')
const __source = document.getElementById('source')
const __player = document.getElementById('player')
const __playerIcon = document.getElementById('icon-player')
const __analysis = document.querySelector('.analysis')
const _appBoardIcon = document.getElementById('app-board-icon')
const __appCloseIcon = document.getElementById('app-close-icon')
const __trackSection = document.getElementById('track-section')
const __trackItems = document.querySelectorAll('.track-item')
const __fireWorks = document.querySelector('#fireworks')
const __appActionInfo = document.getElementById('app-action-info')
const __previousIcon = document.getElementById('app-previous-icon')
const __nextIcon = document.getElementById('app-next-icon')

const fireworks = new Fireworks.default(__fireWorks, {
  hue: {
    min: 0,
    max: 345,
  },
  // delay: {
  //   min: 15,
  //   max: 15
  // },
  // rocketsPoint: 50,
  speed: 10,
  acceleration: 1.2,
  friction: 0.96,
  gravity: 1,
  particles: 90,
  trace: 3,
  explosion: 6,
  autoresize: true,
  brightness: {
    min: 50,
    max: 80,
    decay: {
      min: 0.015,
      max: 0.03,
    },
  },
  boundaries: {
    visible: false,
  },
  sound: {
    enabled: true,
    files: [
      'https://fireworks.js.org/sounds/explosion0.mp3',
      'https://fireworks.js.org/sounds/explosion1.mp3',
      'https://fireworks.js.org/sounds/explosion2.mp3',
    ],
    volume: {
      min: 50,
      max: 100,
    },
  },
  mouse: {
    click: true,
    move: false,
    max: 3,
  },
})

const tracks = [
  {
    title: 'Another Day Of Sun',
    cover: 'https://i.ytimg.com/vi/xVVqlm8Fq3Y/maxresdefault.jpg',
    duration: '3:49',
  },
  {
    title: 'Someone In The Crowd',
    cover: '',
    duration: '4:20',
  },
  {
    title: 'A Lovely Night',
    cover: '',
    duration: '3:57',
  },
  {
    title: "Mia & Sebastian's Theme(Late For The Date)",
    cover: '',
    duration: '1:39',
  },
  {
    title: 'Herman’s Habit',
    cover: '',
    duration: '1:52',
  },
  {
    title: 'City Of Stars',
    cover: 'https://images2.alphacoders.com/789/789853.jpg',
    duration: '2:30',
  },
  {
    title: 'Planetarium',
    cover: '',
    duration: '4:18',
  },
  {
    title: 'Summer Montage',
    cover: '',
    duration: '2:05',
  },
  {
    title: 'Start A Fire',
    cover: '',
    duration: '3:11',
  },
  {
    title: 'Engagement',
    cover: '',
    duration: '1:28',
  },
  {
    title: 'The Fools Who Dream',
    cover: '',
    duration: '3:49',
  },
  {
    title: 'Epilogue',
    cover: '',
    duration: '7:40',
  },
  {
    title: 'City Of Stars (Humming)',
    cover: '',
    duration: '2:44',
  },
  {
    title: 'The End',
    cover: '',
    duration: '0:47',
  },
]

__trackItems.forEach((trackItem) => {
  trackItem.addEventListener('click', (e) => {
    const audioId = trackItem.dataset.id
    const audioTitle = trackItem.dataset.title
    const audioSrc = trackItem.dataset.src

    toggleIconPlayAndPause(audioId)

    if (audioSrc) {
      __source.src = `/songs/${audioSrc}.mp3`
      __audio.load()
      __appActionInfo.innerHTML = audioTitle
      analysis()
    }
  })
})

__appCloseIcon.addEventListener('click', () => {
  __trackSection.classList.remove('visible-flex')
  __trackSection.classList.add('hidden')
})

_appBoardIcon.addEventListener('click', () => {
  if (__trackSection.classList.contains('hidden')) {
    __trackSection.classList.remove('hidden')
    __trackSection.classList.add('visible-flex')
  } else {
    __trackSection.classList.remove('visible-flex')
    __trackSection.classList.add('hidden')
  }
})

__player.addEventListener('click', (e) => {
  pId = __player.dataset.id
  document.getElementById(`track-icon-play-${pId}`).classList.add('hidden')
  analysis()
})

__audio.addEventListener('ended', () => {
  __playerIcon.classList.remove('hidden')
  clearInterval(timeInterval)
  let nPID = parseInt(pId)
  if (nPID >= 14) {
    nPID = 1
  } else if (nPID < 14) {
    nPID += 1
  }

  playSongByTrackId(nPID)
})

__previousIcon.addEventListener('click', (e) => {
  let nPID = parseInt(pId)

  if (nPID <= 1) {
    nPID = 14
  } else {
    nPID -= 1
  }

  playSongByTrackId(nPID)
})

__nextIcon.addEventListener('click', (e) => {
  let nPID = parseInt(pId)

  if (nPID >= 14) {
    nPID = 1
  } else {
    nPID += 1
  }

  playSongByTrackId(nPID)
})

const playSongByTrackId = (nPID) => {
  const trackItem = document.getElementById(`track-item-${nPID}`)
  const audioId = trackItem.dataset.id
  const audioTitle = trackItem.dataset.title
  const audioSrc = trackItem.dataset.src

  toggleIconPlayAndPause(audioId)

  if (audioSrc) {
    __source.src = `/songs/${audioSrc}.mp3`
    __audio.load()
    __appActionInfo.innerHTML = audioTitle
    analysis()
  }
}

const toggleIconPlayAndPause = (audioId) => {
  __trackItems.forEach((trackItem) => {
    trackItem.firstElementChild
      .querySelector('.icon-play')
      .classList.remove('hidden')
  })

  document.getElementById(`track-icon-play-${audioId}`).classList.add('hidden')
  __player.dataset.id = audioId
  pId = audioId
}

const analysis = () => {
  if (!source) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    const ctx = new window.AudioContext()
    const analyser = ctx.createAnalyser()
    source = ctx.createMediaElementSource(__audio)
    source.connect(analyser)
    source.connect(ctx.destination)
    analyser.fftSize = 128
    const buffetLength = analyser.frequencyBinCount

    let dataArray = new Uint8Array(buffetLength)
    let elements = []
    for (let i = 0; i < buffetLength; i++) {
      const bubble = document.createElement('span')
      bubble.classList.add('bubble')
      elements.push(bubble)
      __analysis.appendChild(bubble)
    }

    const update = () => {
      requestAnimationFrame(update)
      analyser.getByteFrequencyData(dataArray)
      for (let i = 0; i < buffetLength; i++) {
        let item = dataArray[i]
        item = item > 150 ? item / 3.5 : item * 5.25
        elements[i].style.transform = `rotate(${
          i * 10 * (360 / buffetLength)
        }deg) translate(-${buffetLength}%,${clamp(item, 75, 150)}px)`
        // elements[i].style.borderRadius = '30% 60% 70% 40% / 50% 60% 30% 60%'
      }
    }
    __audio.paused && update()
  }

  if (__audio.paused) {
    __audio.play()
    __playerIcon.classList.add('hidden')
    timeInterval = setInterval(() => {
      let currentTime = Math.floor(__audio.currentTime)
      let durationTime = Math.floor(__audio.duration)
      // let minute = Math.floor(current / 60)
      // let second = current % 60
      // minute = minute < 10 ? '0' + minute : minute
      // second = second < 10 ? '0' + second : second
      if (parseInt(pId) === 1 && currentTime + 4 >= durationTime) {
        fireworks.start()
        setTimeout(() => {
          fireworks.stop()
        }, 4000)
      }

      if (parseInt(pId) === 2 && currentTime + 6 >= durationTime) {
        fireworks.start()
        setTimeout(() => {
          fireworks.stop()
        }, 4000)
      }

      if (currentTime + 1 >= durationTime) {
        timeStand = 360
      } else {
        timeStand = Math.floor((currentTime / durationTime) * 360)
      }
      player.style.background = `conic-gradient(cyan ${timeStand}deg, transparent 0deg)`
    }, 1000)
  } else {
    __audio.pause()
    __playerIcon.classList.remove('hidden')
    clearInterval(timeInterval)
  }
}

const clamp = (num, min, max) => {
  if (num >= max) return max
  if (num <= min) return min
  return num
}

function formatTime(time) {
  let minutes = Math.floor(time / 60)
  let timeForSeconds = time - minutes * 60 // seconds without counted minutes
  let seconds = Math.floor(timeForSeconds)
  let secondsReadable = seconds > 9 ? seconds : `0${seconds}` // To change 2:2 into 2:02
  return `${minutes}:${secondsReadable}`
}

console.clear();
