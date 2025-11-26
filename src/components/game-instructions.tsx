"use client"

import { useState } from "react"

export function GameInstructions({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)

  const instructions = [
    {
      title: "Cómo Jugar",
      description: "Este es un juego de memoria. Tu objetivo es encontrar parejas de flores.",
      icon: "🎯",
    },
    {
      title: "Haz Clic en las Cartas",
      description: "Haz clic en cualquier carta para voltearla y ver la flor que contiene.",
      icon: "🖱️",
    },
    {
      title: "Encuentra Parejas",
      description: "Intenta encontrar dos cartas con la misma flor. Si coinciden, permanecerán boca arriba.",
      icon: "🌸",
    },
    {
      title: "Tómate tu Tiempo",
      description:
        "No hay prisa. Puedes jugar a tu propio ritmo. Este juego es para divertirse y ejercitar tu memoria.",
      icon: "⏱️",
    },
  ]

  const currentInstruction = instructions[step]

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-2xl p-8 max-w-md shadow-2xl border-4 border-primary animate-fade-in-up">
        <div className="text-6xl mb-4 text-center">{currentInstruction.icon}</div>
        <h2 className="text-3xl font-bold text-primary mb-4 text-center">{currentInstruction.title}</h2>
        <p className="text-xl text-foreground mb-6 text-center">{currentInstruction.description}</p>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {instructions.map((_, index) => (
            <div
              key={index}
              className={`h-3 w-3 rounded-full transition-colors ${index === step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-4">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 px-4 py-3 text-lg font-bold bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors focus:outline-none focus:ring-4 focus:ring-secondary/50"
            >
              Atrás
            </button>
          )}
          {step < instructions.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex-1 px-4 py-3 text-lg font-bold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/50"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full px-4 py-3 text-lg font-bold bg-success text-success-foreground rounded-lg hover:bg-success/90 transition-colors focus:outline-none focus:ring-4 focus:ring-success/50"
            >
              Empezar a Jugar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
