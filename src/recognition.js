document.addEventListener('DOMContentLoaded', function () {
  var recognition = new webkitSpeechRecognition()
  recognition.continuous = true
  recognition.interimResults = true
  recognition.lang = 'pt-BR'

  var recognizing = false
  var getPrevButton = ''
  var vButtonPrev = ''
  var loop = true
  var comandos = [
    'iniciar',
    'curtir',
    'relaxar',
    'descansar',
    'socializar',
    'confraternizar',
    'reconectar',
    'sim',
    'com certeza',
    'voltar',
  ]

  const Link = document.getElementById('Link')
  Link.removeAttribute('href')

  setTimeout(function () {
    Link.setAttribute('href', 'iniciar')
  }, 8400)

  function startRecognition() {
    recognition.start()
  }

  recognition.onend = function () {
    if (loop) {
      startRecognition()
      recognizing = true
    } else {
      recognition.stop()
      recognizing = false
    }
  }

  recognition.onstart = function () {
    recognizing = true
  }

  recognition.onresult = function (event) {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        const comando = event.results[i][0].transcript.trim().toLowerCase()
        console.log(comando)
        let text = false

        for (const item of comandos) {
          if (item.includes(comando)) {
            text = true
            break
          }
        }

        if (text === false) {
          Voices()
        }

        if (text) {
          VideoPlayer(comando.replace(/\s/g, ''))
        } else {
          return
        }
      }
    }
  }

  function clickPlayVideo() {
    const element = document.querySelectorAll('a')

    element.forEach((item) => {
      item.addEventListener('click', function (event) {
        event.preventDefault()

        const getVideo = this.getAttribute('href')

        VideoPlayer(getVideo)
      })
    })
  }
  clickPlayVideo()

  recognition.onerror = function (event) {
    console.error('Erro no reconhecimento de fala: ', event.error)
  }

  function VideoPlayer(comando) {
    if (comando) {
      if (recognizing) {
        recognition.stop()
      }

      if (comando == 'voltar') {
        var prevButtonID = ''
        if (vButtonPrev != '') {
          prevButtonID = vButtonPrev
        } else {
          prevButtonID = alterNumberString(getPrevButton, 'subtract')
        }

        const prevButton = document.getElementById(prevButtonID)
        prevButton.play()
        toggleClassActiveVideo(prevButton)
        return
      }

      loop = false
      const video = document.getElementById(comando)
      const dataID = video.getAttribute('data-id')
      const nextButton = document.getElementById(dataID)

      if (video.hasAttribute('data-prev')) {
        vButtonPrev = video.getAttribute('data-prev')
      }

      getPrevButton = dataID
      toggleClassActiveVideo(video)

      video.play()
      video.addEventListener('ended', () => {
        if (nextButton) {
          toggleClassActiveVideo(nextButton)
          nextButton.play()
        }

        loop = true
        startRecognition()
        if (video.parentNode.id === '5') {
          setTimeout(() => {
            const inicio = document.getElementById('button-0')
            inicio.play()
            toggleClassActiveVideo(inicio)
          }, 7700)
        }
      })
    }
  }

  function alterNumberString(string, operation) {
    const match = string.match(/\d+/)

    if (match) {
      const currentNumber = parseInt(match[0], 10)
      const newNumber =
        operation == 'add' ? currentNumber + 1 : currentNumber - 1
      const newString = string.replace(/\d+/, newNumber)

      return newString
    } else {
      return string
    }
  }

  function toggleClassActiveVideo(video) {
    const elementosAtivos = document.querySelectorAll('.active')
    elementosAtivos.forEach((elemento) => {
      elemento.classList.remove('active')
    })

    const slideID = video.parentNode.id
    const slide = document.getElementById(slideID.toString())

    slide.classList.add('active')
    video.classList.add('active')
  }

  function Voices() {
    const synth = window.speechSynthesis.getVoices()
    const voice = synth.find((voice) => /pt-BR/.test(voice.lang))

    const utterance = new SpeechSynthesisUtterance()

    utterance.text = 'Desculpa! Não entendi, pode repetir?'
    utterance.lang = 'pt-BR'
    utterance.voice = voice
    utterance.rate = 0.8

    window.speechSynthesis.speak(utterance)
  }

  startRecognition()
})
