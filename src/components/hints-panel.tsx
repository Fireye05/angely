"use client"

export function HintsPanel({
  hintsUsed,
  narrationEnabled,
  onToggleNarration,
  onGetHint,
}: {
  hintsUsed: number
  narrationEnabled: boolean
  onToggleNarration: () => void
  onGetHint: () => void
}) {
  return (
    <div className="flex flex-col gap-4 px-4 mb-6">
      <div className="flex gap-3 flex-wrap justify-center">
        {/* Narration toggle - Stimulates Lóbulos Temporales (Language) */}
        <button
          onClick={onToggleNarration}
          className={`px-6 py-3 text-lg font-bold rounded-lg transition-all focus:outline-none focus:ring-4 ${
            narrationEnabled
              ? "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/50"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/90 focus:ring-secondary/50"
          }`}
          aria-label={narrationEnabled ? "Desactivar narración de flores" : "Activar narración de flores"}
        >
          🔊 Narración: {narrationEnabled ? "Activada" : "Desactivada"}
        </button>

        {/* Hint button - Stimulates Corteza Prefrontal (Executive Function) */}
        <button
          onClick={onGetHint}
          className="px-6 py-3 text-lg font-bold bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all focus:outline-none focus:ring-4 focus:ring-accent/50"
          aria-label="Obtener una pista verbal"
        >
          💡 Pista ({hintsUsed})
        </button>
      </div>

      {/* Instructions for using hints */}
      <div className="text-center">
        <p className="text-sm text-foreground/70">Usa las pistas para estimular tu memoria y lenguaje</p>
      </div>
    </div>
  )
}
