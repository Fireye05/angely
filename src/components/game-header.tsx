"use client"

export function GameHeader({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex items-center justify-between mb-8 px-4">
      <h1 className="text-4xl font-bold text-primary">Memorama Flores</h1>
      <button
        onClick={onReset}
        className="px-6 py-3 text-lg font-bold bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors focus:outline-none focus:ring-4 focus:ring-accent/50"
        aria-label="Volver al menú principal"
      >
        Menú
      </button>
    </div>
  )
}
