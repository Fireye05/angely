"use client"

export const DIFFICULTY_SETTINGS = {
  easy: {
    cardCount: 4,
    pairCount: 2,
    timeLimit: null,
    requiredMoveCount: 10,
    hints: 3,
    flippedDuration: 1000,
    description: "Perfecto para comenzar. Solo 2 pares de flores.",
  },
  medium: {
    cardCount: 8,
    pairCount: 4,
    timeLimit: null,
    requiredMoveCount: 16,
    hints: 2,
    flippedDuration: 900,
    description: "Desafía tu memoria con 4 pares de flores.",
  },
  hard: {
    cardCount: 12,
    pairCount: 6,
    timeLimit: null,
    requiredMoveCount: 22,
    hints: 1,
    flippedDuration: 800,
    description: "Máximo desafío con 6 pares de flores.",
  },
}

export function getDifficultyRating(
  difficulty: "easy" | "medium" | "hard",
  moves: number,
  time: number,
): { rating: string; stars: number; message: string } {
  const settings = DIFFICULTY_SETTINGS[difficulty]
  const optimalMoves = settings.requiredMoveCount

  const moveRatio = moves / optimalMoves
  const timeBonus = time < 60 ? 1.2 : time < 120 ? 1.1 : 1.0

  const stars = Math.round(Math.min(5, Math.max(1, (1 / moveRatio) * timeBonus * 3)))
  let rating = ""
  let message = ""

  if (stars >= 5) {
    rating = "Sobresaliente"
    message = "Tu memoria está excelente. Eres un verdadero maestro."
  } else if (stars >= 4) {
    rating = "Muy Bien"
    message = "Excelente desempeño. Mejora cada día."
  } else if (stars >= 3) {
    rating = "Bien"
    message = "Buen esfuerzo. Sigue practicando."
  } else if (stars >= 2) {
    rating = "Aceptable"
    message = "Vuelve a intentarlo. La práctica mejora la memoria."
  } else {
    rating = "Principiante"
    message = "No te desanimes. Cada juego te hace más fuerte."
  }

  return { rating, stars: Math.min(stars, 5), message }
}
