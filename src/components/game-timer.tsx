"use client"

import { useEffect, useState } from "react"

type GameTimerProps = {
  isActive: boolean
  onTimeElapsed?: (seconds: number) => void
}

export function GameTimer({ isActive, onTimeElapsed }: GameTimerProps) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setSeconds((prev) => {
        const newSeconds = prev + 1
        onTimeElapsed?.(newSeconds)
        return newSeconds
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, onTimeElapsed])

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="bg-card rounded-xl p-6 text-center border-4 border-warning flex flex-col items-center justify-center">
      <div className="text-xl font-semibold text-foreground/70 mb-2">Tiempo Transcurrido</div>
      <div className="text-4xl font-bold text-warning font-mono">{formatTime(seconds)}</div>
    </div>
  )
}
