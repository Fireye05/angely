import { forwardRef, useImperativeHandle } from "react"

export const AudioFeedback = forwardRef(function AudioFeedback(_, ref) {
  useImperativeHandle(ref, () => ({
    playFlip: () => playSound("flip"),
    playSuccess: () => playSound("success"),
    playFail: () => playSound("fail"),
    playGameStart: () => playSound("gameStart"),
    playGameWon: () => playSound("gameWon"),
    narrateName: (name: string) => narrateText(name),
  }))

  const playSound = (soundType: string) => {
    // Create audio context for sound generation
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const now = audioContext.currentTime

    try {
      switch (soundType) {
        case "flip":
          // Flip sound: short beep
          playTone(audioContext, 600, 0.1, 0.05)
          break
        case "success":
          // Success sound: ascending two-tone
          playTone(audioContext, 800, 0.15, 0.1)
          playTone(audioContext, 1000, 0.15, 0.1, 0.1)
          break
        case "fail":
          // Fail sound: descending two-tone
          playTone(audioContext, 400, 0.15, 0.1)
          playTone(audioContext, 300, 0.15, 0.1, 0.1)
          break
        case "gameStart":
          // Game start: three ascending tones
          playTone(audioContext, 500, 0.1, 0.08)
          playTone(audioContext, 600, 0.1, 0.08, 0.1)
          playTone(audioContext, 700, 0.1, 0.08, 0.2)
          break
        case "gameWon":
          // Game won: celebration sound
          playTone(audioContext, 800, 0.15, 0.15)
          playTone(audioContext, 1000, 0.15, 0.15, 0.1)
          playTone(audioContext, 1200, 0.15, 0.15, 0.2)
          break
      }
    } catch (e) {
      console.log("[v0] Audio feedback not available")
    }
  }

  const playTone = (audioContext: AudioContext, frequency: number, volume: number, duration: number, delay = 0) => {
    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()

    osc.connect(gain)
    gain.connect(audioContext.destination)

    osc.frequency.value = frequency
    osc.type = "sine"

    gain.gain.setValueAtTime(volume, audioContext.currentTime + delay)
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + duration)

    osc.start(audioContext.currentTime + delay)
    osc.stop(audioContext.currentTime + delay + duration)
  }

  const narrateText = (text: string) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "es-ES"
      utterance.rate = 0.8 // Slow rate for elderly users
      utterance.pitch = 1
      utterance.volume = 1
      window.speechSynthesis.cancel() // Cancel any ongoing speech
      window.speechSynthesis.speak(utterance)
    } catch (e) {
      console.log("[v0] Speech synthesis not available")
    }
  }

  return null
})
