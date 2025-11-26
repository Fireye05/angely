
import React, { useState, useRef, useEffect } from 'react';
import { AudioFeedback } from "@/components/audio-feedback"
import { GameHeader } from "@/components/game-header"
import { GameInstructions } from './game-instructions';
import { GameTimer } from './game-timer';
import { HintsPanel } from './hints-panel';
import { GameStats } from './game-stats';
import { GameBoard } from './game-board';


interface Flower {
  id: number;
  name: string;
  emoji: string;
}

interface GameCard {
  flowerId: number
  isFlipped: boolean
  isMatched: boolean
}

const flowers: Flower[] = [
  { id: 1, name: "Rosa", emoji: "🌹" },
  { id: 2, name: "Girasol", emoji: "🌻" },
  { id: 3, name: "Tulipán", emoji: "🌷" },
  { id: 4, name: "Flor de Loto", emoji: "🪷" },
  { id: 5, name: "Margarita", emoji: "🼼" },
  { id: 6, name: "Lirio", emoji: "⚜️" },
  { id: 7, name: "Flor de Cerezo", emoji: "🌸" },
  { id: 8, name: "Hibisco", emoji: "🌺" },
]


const MemoryGame: React.FC = () => {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | null>(null)
  const [cards, setCards] = useState<GameCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matches, setMatches] = useState(0)
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [narrationEnabled, setNarrationEnabled] = useState(true)
  const [unlockedRewards, setUnlockedRewards] = useState<number[]>([])
  const [newRewardId, setNewRewardId] = useState<number | null>(null)
  const audioFeedbackRef = useRef<any>(null)


  useEffect(() => {
    if (!difficulty) return

    const cardCount = difficulty === "easy" ? 4 : difficulty === "medium" ? 8 : 12
    const selectedFlowers = flowers.slice(0, cardCount / 2)
    const gameCards = [...selectedFlowers, ...selectedFlowers]
      .sort(() => Math.random() - 0.5)
      .map((flower, index) => ({
        flowerId: flower.id,
        isFlipped: false,
        isMatched: false,
      }))

    setCards(gameCards)
    setFlippedCards([])
    setMatches(0)
    setMoves(0)
    setGameWon(false)
    setElapsedTime(0)
    setHintsUsed(0)
    audioFeedbackRef.current?.playGameStart()
  }, [difficulty])

  const handleCardFlip = (index: number) => {
    if (gameWon || cards[index].isMatched || flippedCards.length === 2) return
    if (flippedCards.includes(index)) return

    const newFlipped = [...flippedCards, index]
    setFlippedCards(newFlipped)
    audioFeedbackRef.current?.playFlip()

    const flower = flowers.find((f) => f.id === cards[index].flowerId)
    if (narrationEnabled && flower && newFlipped.length === 1) {
      setTimeout(() => {
        audioFeedbackRef.current?.narrateName(flower.name)
      }, 300)
    }

    if (newFlipped.length === 2) {
      setMoves(moves + 1)

      const [first, second] = newFlipped
      if (cards[first].flowerId === cards[second].flowerId) {
        audioFeedbackRef.current?.playSuccess()
        const matchedFlower = flowers.find((f) => f.id === cards[first].flowerId)
        setTimeout(() => {
          setCards((prev) => prev.map((card, i) => (i === first || i === second ? { ...card, isMatched: true } : card)))
          setMatches(matches + 1)
          if (narrationEnabled && matchedFlower) {
            audioFeedbackRef.current?.narrateName(`Excelente, encontraste ${matchedFlower.name}`)
          }
          setFlippedCards([])
        }, 800)
      } else {
        audioFeedbackRef.current?.playFail()
        setTimeout(() => {
          setFlippedCards([])
        }, 1200)
      }
    }
  }

  const handleGetHint = () => {
    const unmatched = cards.map((card, index) => ({ card, index })).filter(({ card }) => !card.isMatched)

    if (unmatched.length < 2) return

    const card1 = unmatched[0]
    const card2 = unmatched.find((c) => c.card.flowerId === card1.card.flowerId)

    if (card2) {
      const flower = flowers.find((f) => f.id === card1.card.flowerId)
      if (flower) {
        audioFeedbackRef.current?.narrateName(`Busca dos ${flower.name}s`)
        setHintsUsed(hintsUsed + 1)
      }
    }
  }

  useEffect(() => {
    if (cards.length > 0 && matches > 0 && matches === cards.length / 2) {
      setGameWon(true)
      audioFeedbackRef.current?.playGameWon()
    }
  }, [matches, cards.length])


  const handleReset = () => {
    setDifficulty(null)
    setShowInstructions(true)
    setElapsedTime(0)
  }


  function WinScreen({
    moves,
    time,
    hints,
    onPlayAgain,
  }: { moves: number; time: number; hints: number; onPlayAgain: () => void }) {
    const formatTime = (totalSeconds: number) => {
      const minutes = Math.floor(totalSeconds / 60)
      const secs = totalSeconds % 60
      return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }



    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl p-8 text-center max-w-md shadow-2xl border-4 border-success animate-fade-in-up">
          <h2 className="text-4xl font-bold text-success mb-4 animate-pulse-success">¡Ganaste!</h2>
          <div className="space-y-4 mb-8">
            <p className="text-2xl text-foreground">
              Completaste el juego en <span className="font-bold text-accent">{moves}</span> movimientos
            </p>
            <p className="text-2xl text-foreground">
              Tiempo total: <span className="font-bold text-warning font-mono">{formatTime(time)}</span>
            </p>
            <p className="text-2xl text-foreground">
              Pistas utilizadas: <span className="font-bold text-primary">{hints}</span>
            </p>
          </div>
          <button
            onClick={onPlayAgain}
            className="px-8 py-4 text-xl font-bold bg-success text-success-foreground rounded-lg hover:bg-success/90 transition-colors focus:outline-none focus:ring-4 focus:ring-success/50 w-full"
          >
            Jugar de Nuevo
          </button>
        </div>
      </div>
    )
  }


  function DifficultySelector() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-12 px-4">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-primary mb-4">Memorama Flores</h1>
          <p className="text-2xl text-foreground/80 mb-6">Elige tu nivel de dificultad</p>
          <p className="text-xl text-foreground/70">Empareja todas las flores para ganar</p>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-md">
          <button
            onClick={() => setDifficulty("easy")}
            className="px-8 py-6 text-2xl font-bold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/50"
            aria-label="Nivel Fácil - 4 cartas"
          >
            Fácil (4 cartas)
          </button>
          <button
            onClick={() => setDifficulty("medium")}
            className="px-8 py-6 text-2xl font-bold bg-accent text-accent-foreground rounded-xl hover:bg-accent/90 transition-colors focus:outline-none focus:ring-4 focus:ring-accent/50"
            aria-label="Nivel Medio - 8 cartas"
          >
            Medio (8 cartas)
          </button>
          <button
            onClick={() => setDifficulty("hard")}
            className="px-8 py-6 text-2xl font-bold bg-warning text-warning-foreground rounded-xl hover:bg-warning/90 transition-colors focus:outline-none focus:ring-4 focus:ring-warning/50"
            aria-label="Nivel Difícil - 12 cartas"
          >
            Difícil (12 cartas)
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 from-background to-secondary">
      <AudioFeedback ref={audioFeedbackRef} />
      <div className="w-full max-w-2xl">
        {!difficulty ? (
          <DifficultySelector />
        ) : (
          <>
            <GameHeader onReset={handleReset} />
            {showInstructions && <GameInstructions onClose={() => setShowInstructions(false)} />}
            <div className="px-4 mb-8">
              <GameTimer isActive={!showInstructions && !gameWon} onTimeElapsed={setElapsedTime} />
            </div>
            <HintsPanel
              hintsUsed={hintsUsed}
              narrationEnabled={narrationEnabled}
              onToggleNarration={() => setNarrationEnabled(!narrationEnabled)}
              onGetHint={handleGetHint}
            />
            <GameStats matches={matches} moves={moves} totalCards={cards.length} />
            <GameBoard cards={cards} flippedCards={flippedCards} flowers={flowers} onCardFlip={handleCardFlip} />
            {gameWon && <WinScreen moves={moves} time={elapsedTime} hints={hintsUsed} onPlayAgain={handleReset} />}
          </>
        )}
      </div>
    </div>
  )


}


export default MemoryGame;