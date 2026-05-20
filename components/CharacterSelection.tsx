"use client"

import { useRef, useEffect } from "react"

interface CharacterSelectionProps {
  onStart: () => void
}

export function CharacterSelection({ onStart }: CharacterSelectionProps) {
  const gameStartSoundRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    gameStartSoundRef.current = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/game-start-6104-bTsqlnyY4bUZPbu90WdwJrWXM1EbCq.mp3")
    gameStartSoundRef.current.volume = 0.4
  }, [])

  const handleStart = () => {
    if (gameStartSoundRef.current) {
      gameStartSoundRef.current.currentTime = 0
      gameStartSoundRef.current.play().catch(() => {})
    }
    onStart()
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm font-pixel">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-indigo-400 mb-2 tracking-tight">Pixel Survivor</h1>
        <p className="text-zinc-400 mb-12 text-lg">Survive the endless waves</p>

        <button
          onClick={handleStart}
          className="px-12 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-bold text-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-indigo-500/50"
        >
          Start Game
        </button>
      </div>
    </div>
  )
}
