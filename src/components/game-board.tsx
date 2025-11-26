"use client"

type Flower = {
  id: number
  name: string
  emoji: string
}

type GameCard = {
  flowerId: number
  isFlipped: boolean
  isMatched: boolean
}

export function GameBoard({
  cards,
  flippedCards,
  flowers,
  onCardFlip,
  onFlowerMatched,
}: {
  cards: GameCard[]
  flippedCards: number[]
  flowers: Flower[]
  onCardFlip: (index: number) => void
  onFlowerMatched?: (flowerName: string) => void
}) {
  const gridCols = cards.length <= 4 ? "grid-cols-2" : cards.length <= 8 ? "grid-cols-4" : "grid-cols-4"

  return (
    <div className={`grid ${gridCols} gap-4 px-4 mb-8`}>
      {cards.map((card, index) => {
        const flower = flowers.find((f) => f.id === card.flowerId)
        const isFlipped = flippedCards.includes(index) || card.isMatched
        const isDisabled = card.isMatched || flippedCards.length === 2

        return (
          <button
            key={index}
            onClick={() => onCardFlip(index)}
            disabled={isDisabled && !isFlipped}
            className={`
              aspect-square rounded-xl font-bold text-5xl
              transition-all duration-300 ease-out
              focus:outline-none focus:ring-4 focus:ring-primary/50
              ${
                isFlipped
                  ? "bg-card text-foreground border-4 border-primary shadow-lg"
                  : "bg-primary text-primary-foreground border-4 border-primary hover:shadow-md hover:scale-105"
              }
              ${card.isMatched ? "ring-4 ring-success/50 bg-success/20" : ""}
              disabled:cursor-not-allowed
            `}
            aria-label={`Carta ${index + 1}${isFlipped ? `: ${flower?.name}` : ""}`}
            aria-pressed={isFlipped}
          >
            {isFlipped && flower ? flower.emoji : "?"}
          </button>
        )
      })}
    </div>
  )
}
