"use client"

type Reward = {
  id: number
  title: string
  description: string
  content: string
  icon: string
  unlockedAt?: number
  type: "historical" | "personal" | "achievement"
}

export const REWARDS_DATABASE: Reward[] = [
  {
    id: 1,
    title: "Datos Históricos: La Rosa",
    description: "Aprende sobre la historia de la flor más romántica",
    content:
      "La rosa es símbolo de amor desde la antigüedad. En la Edad Media, los poetas españoles ya cantaban sus virtudes. En Venezuela, las rosas crecen en todas las regiones.",
    icon: "🌹",
    type: "historical",
  },
  {
    id: 2,
    title: "Datos Históricos: El Girasol",
    description: "El seguidor del sol, emblema de lealtad",
    content:
      "Van Gogh pintó los girasoles como símbolo de alegría. En la antigüedad, los aztecas lo consideraban sagrado. El girasol sigue al sol durante todo el día, un acto de devoción.",
    icon: "🌻",
    type: "historical",
  },
  {
    id: 3,
    title: "Datos Históricos: El Tulipán",
    description: "La flor que enloqueció a Europa en el siglo XVII",
    content:
      'Los tulipanes causaron la "Tulipomanía" en Holanda. Un solo bulbo podía valer una casa. Los tulipanes simbolizan la perfección y la elegancia en el mundo.',
    icon: "🌷",
    type: "historical",
  },
  {
    id: 4,
    title: "Logro Especial: Maestro del Nivel Fácil",
    description: "Completaste el nivel fácil con menos de 10 movimientos",
    content:
      "Excelente memoria visual. Tu hipocampo está trabajando de maravilla. Esto demuestra control y precisión en tus decisiones.",
    icon: "⭐",
    type: "achievement",
  },
  {
    id: 5,
    title: "Logro Especial: Campeón del Tiempo",
    description: "Ganaste un nivel en menos de 2 minutos",
    content:
      "Tu velocidad de procesamiento es excepcional. Demostraste concentración y agilidad mental. Los adultos mayores con estas habilidades tienen mejor calidad de vida.",
    icon: "🏆",
    type: "achievement",
  },
  {
    id: 6,
    title: "Datos Históricos: La Flor de Loto",
    description: "Símbolo de renacimiento y purificación",
    content:
      "En la filosofía oriental, la flor de loto representa la transformación del espíritu. Florece en aguas turbias, simbolizando esperanza. En Venezuela, florece en los humedales.",
    icon: "🪷",
    type: "historical",
  },
]

interface RewardsUnlockProps {
  unlockedRewardIds: number[]
  onClose: () => void
  newRewardId: number
}

export function RewardsUnlock({ unlockedRewardIds, onClose, newRewardId }: RewardsUnlockProps) {
  const reward = REWARDS_DATABASE.find((r) => r.id === newRewardId)

  if (!reward) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-2xl p-8 max-w-xl shadow-2xl border-4 border-accent animate-fade-in-up">
        <div className="text-center mb-6">
          <div className="text-7xl mb-4">{reward.icon}</div>
          <h2 className="text-3xl font-bold text-primary mb-2">¡Recompensa Desbloqueada!</h2>
          <h3 className="text-2xl font-bold text-accent mb-4">{reward.title}</h3>
        </div>

        <div className="bg-background/50 rounded-lg p-6 mb-6">
          <p className="text-xl text-foreground leading-relaxed">{reward.content}</p>
        </div>

        <div className="text-center text-sm text-foreground/70 mb-6">
          <p>
            Recompensa {unlockedRewardIds.length} de {REWARDS_DATABASE.length}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full px-6 py-4 text-xl font-bold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/50"
        >
          Continuar Jugando
        </button>
      </div>
    </div>
  )
}

export function RewardsGallery({ unlockedRewardIds }: { unlockedRewardIds: number[] }) {
  return (
    <div className="mt-8 p-6 bg-background/50 rounded-lg">
      <h3 className="text-2xl font-bold text-primary mb-6">Recompensas Desbloqueadas</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {REWARDS_DATABASE.map((reward) => (
          <div
            key={reward.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              unlockedRewardIds.includes(reward.id)
                ? "bg-accent/20 border-accent"
                : "bg-background/50 border-foreground/20 opacity-50"
            }`}
          >
            <div className="text-4xl mb-2 text-center">{reward.icon}</div>
            <p className="text-sm font-semibold text-center text-foreground line-clamp-2">{reward.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
