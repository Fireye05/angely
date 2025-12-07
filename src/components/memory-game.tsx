
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
  path: string;
}

interface GameCard {
  flowerId: number
  isFlipped: boolean
  isMatched: boolean
}

const flowers: Flower[] = [
  { id: 1, name: "Rosa", path: "src/assets/flores/rosa.png" },
  { id: 2, name: "Campanillas", path: "src/assets/flores/campanillas.png" },
  { id: 3, name: "Tulipán", path: "src/assets/flores/tulipan.png" },
  { id: 4, name: "Lírio", path: "src/assets/flores/lirio.png" },
  { id: 5, name: "Suculenta", path: "src/assets/flores/suculenta.png" },
  { id: 6, name: "Margarita", path: "src/assets/flores/margarita.png" },
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


  function WinScreen({ moves, time, hints, onPlayAgain }: { moves: number; time: number; hints: number; onPlayAgain: () => void }) {
    const formatTime = (totalSeconds: number) => {
      const minutes = Math.floor(totalSeconds / 60)
      const secs = totalSeconds % 60
      return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(30,42,56,0.95)' }}>
        <div className="rounded-2xl p-8 text-center max-w-md shadow-2xl border-4 animate-fade-in-up" style={{ backgroundColor: '#1E2A38', borderColor: '#4BB5F2' }}>
          <h2 className="text-4xl font-bold mb-4 animate-pulse-success text-white">¡Ganaste!</h2>
          <div className="space-y-4 mb-8">
            <p className="text-2xl text-white">
              Completaste el juego en <span className="font-bold text-[#4BB5F2]">{moves}</span> movimientos
            </p>
            <p className="text-2xl text-white">
              Tiempo total: <span className="font-bold text-[#4BEAF2] font-mono">{formatTime(time)}</span>
            </p>
            <p className="text-2xl text-white">
              Pistas utilizadas: <span className="font-bold text-[#824BF2]">{hints}</span>
            </p>
          </div>
          <button
            onClick={onPlayAgain}
            className="px-8 py-4 text-xl font-bold rounded-lg transition-colors focus:outline-none focus:ring-4 w-full bg-[#4BB5F2] text-[#1E2A38] hover:bg-[#4BEAF2]"
          >
            Jugar de Nuevo
          </button>
        </div>
      </div>
    )
  }


  function DifficultySelector() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-12 px-4 bg-[#1E2A38]">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 text-white">Memorama Flores</h1>
          <p className="text-2xl mb-6 text-white">Elige tu nivel de dificultad</p>
          <p className="text-xl text-white opacity-80">Empareja todas las flores para ganar</p>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-md">
          <button
            onClick={() => setDifficulty('easy')}
            className="px-8 py-6 text-2xl font-bold rounded-xl transition-colors focus:outline-none focus:ring-4 w-full bg-[#4BB5F2] text-[#1E2A38] hover:bg-[#4BB5F2]/70"
            aria-label="Nivel Fácil - 4 cartas"
          >
            Fácil (4 cartas)
          </button>
          <button
            onClick={() => setDifficulty('medium')}
            className="px-8 py-6 text-2xl font-bold rounded-xl transition-colors focus:outline-none focus:ring-4 w-full bg-[#4B80F2] text-white hover:bg-[#4B80F2]/70"
            aria-label="Nivel Medio - 8 cartas"
          >
            Medio (8 cartas)
          </button>
          <button
            onClick={() => setDifficulty('hard')}
            className="px-8 py-6 text-2xl font-bold rounded-xl transition-colors focus:outline-none focus:ring-4 w-full bg-[#824BF2] text-white hover:bg-[#824BF2]/70"
            aria-label="Nivel Difícil - 12 cartas"
          >
            Difícil (12 cartas)
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 from-background to-secondary bg-[#1E2A38]">
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