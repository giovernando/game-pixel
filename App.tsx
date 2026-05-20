"use client"

import type React from "react"
import { useState } from "react"
import { SpriteCanvas } from "./components/SpriteCanvas"
import { CharacterSelection } from "./components/CharacterSelection"

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false)
  const [selectedCharacter] = useState<string>("/mo.png")
  const [spriteSrc] = useState<string>("/mo.png")
  const [zombieSrc] = useState<string>("/zombie.png")
  const [skeletonSrc] = useState<string>("/skeleton.png")
  const [attackSrc] = useState<string>("/mo-attack.png")
  const [shouldStartGame, setShouldStartGame] = useState(false)

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950">
      <div className="w-full h-full">
        {!gameStarted && (
          <CharacterSelection
            onStart={() => {
              setGameStarted(true)
              setShouldStartGame(true)
            }}
          />
        )}

        <div className="absolute inset-0 w-full h-full bg-zinc-900">
          <SpriteCanvas
            spriteSrc={spriteSrc}
            zombieSrc={zombieSrc}
            skeletonSrc={skeletonSrc}
            attackSrc={attackSrc}
            onSelectAnotherCharacter={() => {}}
            startGame={shouldStartGame}
          />
        </div>
      </div>
    </div>
  )
}

export default App
