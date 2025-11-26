export function GameStats({ matches, moves, totalCards }: { matches: number; moves: number; totalCards: number }) {
  const totalMatches = totalCards / 2

  return (
    <div className="grid grid-cols-3 gap-4 mb-8 px-4">
      <div className="bg-card rounded-xl p-6 text-center border-4 border-primary">
        <div className="text-xl font-semibold text-foreground/70 mb-2">Parejas Encontradas</div>
        <div className="text-4xl font-bold text-primary">
          {matches}/{totalMatches}
        </div>
      </div>
      <div className="bg-card rounded-xl p-6 text-center border-4 border-accent">
        <div className="text-xl font-semibold text-foreground/70 mb-2">Movimientos</div>
        <div className="text-4xl font-bold text-accent">{moves}</div>
      </div>
      <div className="bg-card rounded-xl p-6 text-center border-4 border-primary/60">
        <div className="text-xl font-semibold text-foreground/70 mb-2">Progreso</div>
        <div className="text-4xl font-bold text-primary/80">
          {totalCards === 0 ? "0" : Math.round((matches / totalMatches) * 100)}%
        </div>
      </div>
    </div>
  )
}
