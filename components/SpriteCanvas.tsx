"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { Direction, type SpriteConfig, type Zombie, type Skeleton, type Wolf } from "../types"

interface SpriteCanvasProps {
  spriteSrc: string | null
  zombieSrc: string | null
  skeletonSrc: string | null
  wolfSrc: string | null
  attackSrc?: string | null
  isFullView?: boolean
  startGame?: boolean
}

export const SpriteCanvas: React.FC<SpriteCanvasProps> = ({
  spriteSrc,
  zombieSrc,
  skeletonSrc,
  wolfSrc,
  attackSrc,
  isFullView,
  startGame,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ambianceAudioRef = useRef<HTMLAudioElement | null>(null)
  const attackAudioRef = useRef<HTMLAudioElement | null>(null)
  const countdownAudioRef = useRef<HTMLAudioElement | null>(null)
  const gameStartSoundRef = useRef<HTMLAudioElement | null>(null)

  // React State for UI overlays
  const [score, setScore] = useState(0)
  const [zombiesKilled, setZombiesKilled] = useState(0)
  const [skeletonsKilled, setSkeletonsKilled] = useState(0)
  const [wolvesKilled, setWolvesKilled] = useState(0)
  const [gameState, setGameState] = useState<"WAITING" | "COUNTDOWN" | "PLAYING" | "GAME_OVER">("WAITING")
  const [countdown, setCountdown] = useState(3)

  const gameStartTimeRef = useRef<number>(0)
  const lastScoreUpdateRef = useRef<number>(0)
  const lastZombieSpawnRef = useRef<number>(0)
  const lastSkeletonSpawnRef = useRef<number>(0)
  const lastWolfSpawnRef = useRef<number>(0)
  const lastFrameTimeRef = useRef<number>(0)

  // Game Logic Refs
  const posRef = useRef({ x: 400, y: 300 }) // Centered player at canvas center (800x600 canvas)
  const zombiesRef = useRef<Zombie[]>([])
  const skeletonsRef = useRef<Skeleton[]>([])
  const wolvesRef = useRef<Wolf[]>([])
  const inputRef = useRef({ up: false, down: false, left: false, right: false })
  const directionRef = useRef<Direction>(Direction.DOWN)
  const isMovingRef = useRef(false)
  const frameRef = useRef(0)
  const tickRef = useRef(0)
  const isAttackingRef = useRef(false)
  const attackStartTimeRef = useRef(0)

  // Configuration
  const config: SpriteConfig = {
    rows: 4,
    cols: 4,
    scale: 0.75,
    speed: 250,
    animationSpeed: 8,
  }

  // Initialize Game / Start Countdown
  const initGameSequence = useCallback(() => {
    if (gameStartSoundRef.current) {
      gameStartSoundRef.current.currentTime = 0
      gameStartSoundRef.current.play().catch(() => {})
    }

    posRef.current = { x: 400, y: 300 } // Reset player to center position
    isAttackingRef.current = false
    attackStartTimeRef.current = 0
    zombiesRef.current = []
    skeletonsRef.current = []
    wolvesRef.current = []
    directionRef.current = Direction.DOWN
    inputRef.current = { up: false, down: false, left: false, right: false }

    gameStartTimeRef.current = 0
    lastScoreUpdateRef.current = 0
    lastZombieSpawnRef.current = 0
    lastSkeletonSpawnRef.current = 0
    lastWolfSpawnRef.current = 0
    lastFrameTimeRef.current = 0

    setScore(0)
    setZombiesKilled(0)
    setSkeletonsKilled(0)
    setWolvesKilled(0)
    setCountdown(3)
    setGameState("COUNTDOWN")
  }, [spriteSrc])

  useEffect(() => {
    if (startGame && spriteSrc) {
      initGameSequence()
    }
  }, [startGame, spriteSrc, initGameSequence])

  useEffect(() => {
    if (gameState !== "COUNTDOWN") return

    // Play countdown sound
    if (countdown > 0 && countdownAudioRef.current) {
      countdownAudioRef.current.currentTime = 0
      countdownAudioRef.current.play().catch(() => {})
    }

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      // Countdown finished, start playing
      setGameState("PLAYING")
    }
  }, [gameState, countdown])

  // Input Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "PLAYING") return
      switch (e.key) {
        case " ":
          if (!isAttackingRef.current && attackSrc) {
            isAttackingRef.current = true
            attackStartTimeRef.current = Date.now()
            frameRef.current = 0
            tickRef.current = 0
            if (attackAudioRef.current) {
              attackAudioRef.current.currentTime = 0
              attackAudioRef.current.play().catch(() => {})
            }
          }
          break
        case "ArrowUp":
          inputRef.current.up = true
          break
        case "ArrowDown":
          inputRef.current.down = true
          break
        case "ArrowLeft":
          inputRef.current.left = true
          break
        case "ArrowRight":
          inputRef.current.right = true
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          inputRef.current.up = false
          break
        case "ArrowDown":
          inputRef.current.down = false
          break
        case "ArrowLeft":
          inputRef.current.left = false
          break
        case "ArrowRight":
          inputRef.current.right = false
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [gameState, attackSrc])

  // Resize Handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Audio Setup
  useEffect(() => {
    ambianceAudioRef.current = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ambiance-loop-Z3O5o2k4J2bQ7GPbzQpCYRWs41CELb.mp3")
    ambianceAudioRef.current.loop = true
    ambianceAudioRef.current.volume = 0.3

    attackAudioRef.current = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attack-vxTW9VgPMpdGRNXBddoMu9TkmLAFdl.mp3")
    attackAudioRef.current.volume = 0.5

    countdownAudioRef.current = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/countdown-mH4e18jiUxp0uP4JzPJ2RooTlQzXxC.mp3")
    countdownAudioRef.current.volume = 0.5

    gameStartSoundRef.current = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/game-start-6104-bTsqlnyY4bUZPbu90WdwJrWXM1EbCq.mp3")
    gameStartSoundRef.current.volume = 0.4

    return () => {
      if (ambianceAudioRef.current) {
        ambianceAudioRef.current.pause()
        ambianceAudioRef.current = null
      }
      if (attackAudioRef.current) {
        attackAudioRef.current = null
      }
      if (countdownAudioRef.current) {
        countdownAudioRef.current = null
      }
      if (gameStartSoundRef.current) {
        gameStartSoundRef.current = null
      }
    }
  }, [])

  // Background Music
  useEffect(() => {
    if (gameState === "PLAYING" && ambianceAudioRef.current) {
      ambianceAudioRef.current.play().catch(() => {})
    } else if (gameState === "GAME_OVER" && ambianceAudioRef.current) {
      ambianceAudioRef.current.pause()
      ambianceAudioRef.current.currentTime = 0
    }
  }, [gameState])

  // Main Game Loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth || 800
    canvas.height = canvas.offsetHeight || 600

    ctx.imageSmoothingEnabled = false

    const playerImg = new Image()
    if (spriteSrc) playerImg.src = spriteSrc

    const attackImg = new Image()
    if (attackSrc) attackImg.src = attackSrc

    const zombieImg = new Image()
    zombieImg.src = "/zombie.png"

    const skeletonImg = new Image()
    skeletonImg.src = "/skeleton.png"

    const wolfImg = new Image()
    wolfImg.src = "/wolf.png"

    let animationFrameId: number
    let isMounted = true

    const render = (currentTime: number) => {
      if (!isMounted) return

      if (lastFrameTimeRef.current === 0) {
        lastFrameTimeRef.current = currentTime
      }
      const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000
      lastFrameTimeRef.current = currentTime

      // Draw background
      ctx.fillStyle = "#18181b"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = "#27272a"
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
      }
      ctx.stroke()

      if (gameState === "PLAYING") {
        const now = Date.now()

        if (isAttackingRef.current) {
          const attackElapsed = now - attackStartTimeRef.current
          const attackDuration = 250 // Reduced attack duration from 500ms to 250ms for faster attack animation

          if (attackElapsed >= attackDuration) {
            isAttackingRef.current = false
            frameRef.current = 0
          } else {
            const totalFrames = config.cols
            const frameDuration = attackDuration / totalFrames
            const currentFrame = Math.floor(attackElapsed / frameDuration)
            frameRef.current = Math.min(currentFrame, totalFrames - 1)

            const attackRange = 80
            const zombiesBeforeAttack = zombiesRef.current.length
            zombiesRef.current = zombiesRef.current.filter((zombie) => {
              const dx = zombie.x - posRef.current.x
              const dy = zombie.y - posRef.current.y
              const distance = Math.sqrt(dx * dx + dy * dy)
              return distance > attackRange
            })
            const zombiesAfterAttack = zombiesRef.current.length
            const zombiesKilledNow = zombiesBeforeAttack - zombiesAfterAttack
            if (zombiesKilledNow > 0) {
              setZombiesKilled((prev) => prev + zombiesKilledNow)
            }

            const skeletonsBeforeAttack = skeletonsRef.current.length
            skeletonsRef.current = skeletonsRef.current.filter((skeleton) => {
              const dx = skeleton.x - posRef.current.x
              const dy = skeleton.y - posRef.current.y
              const distance = Math.sqrt(dx * dx + dy * dy)
              return distance > attackRange
            })
            const skeletonsAfterAttack = skeletonsRef.current.length
            const skeletonsKilledNow = skeletonsBeforeAttack - skeletonsAfterAttack
            if (skeletonsKilledNow > 0) {
              setSkeletonsKilled((prev) => prev + skeletonsKilledNow)
            }

            const wolvesBeforeAttack = wolvesRef.current.length
            wolvesRef.current = wolvesRef.current.filter((wolf) => {
              const dx = wolf.x - posRef.current.x
              const dy = wolf.y - posRef.current.y
              const distance = Math.sqrt(dx * dx + dy * dy)
              return distance > attackRange
            })
            const wolvesAfterAttack = wolvesRef.current.length
            const wolvesKilledNow = wolvesBeforeAttack - wolvesAfterAttack
            if (wolvesKilledNow > 0) {
              setWolvesKilled((prev) => prev + wolvesKilledNow)
            }
          }
        }

        if (gameStartTimeRef.current === 0) {
          gameStartTimeRef.current = now
          lastScoreUpdateRef.current = now
          lastZombieSpawnRef.current = now
          lastSkeletonSpawnRef.current = now
          lastWolfSpawnRef.current = now
        }

        const elapsedTime = (now - gameStartTimeRef.current) / 1000

        if (now - lastScoreUpdateRef.current >= 1000) {
          setScore((prevScore) => prevScore + 1)
          lastScoreUpdateRef.current = now
        }

        let spawnMultiplier = 1
        if (elapsedTime >= 60) {
          const intervalsAfter60 = Math.floor((elapsedTime - 60) / 30)
          spawnMultiplier = Math.pow(1.15, intervalsAfter60)
        }

        // Zombie spawn logic
        const zombieDifficultyLevel = Math.floor(elapsedTime / 10)
        const maxZombies = Math.floor((5 + zombieDifficultyLevel * 2) * spawnMultiplier)
        const zombieSpawnInterval = Math.max(1.5, 3 - zombieDifficultyLevel * 0.3) * 1000

        if (now - lastZombieSpawnRef.current >= zombieSpawnInterval && zombiesRef.current.length < maxZombies) {
          const side = Math.floor(Math.random() * 4)
          let spawnX = 0,
            spawnY = 0
          const buffer = 50

          switch (side) {
            case 0:
              spawnX = Math.random() * canvas.width
              spawnY = -buffer
              break
            case 1:
              spawnX = canvas.width + buffer
              spawnY = Math.random() * canvas.height
              break
            case 2:
              spawnX = Math.random() * canvas.width
              spawnY = canvas.height + buffer
              break
            case 3:
              spawnX = -buffer
              spawnY = Math.random() * canvas.height
              break
          }

          zombiesRef.current.push({
            id: Math.random(),
            x: spawnX,
            y: spawnY,
            speed: 50 + Math.random() * 30 + zombieDifficultyLevel * 5,
            direction: Direction.DOWN,
            frameIndex: 0,
            tickCount: 0,
          })

          lastZombieSpawnRef.current = now
        }

        // Skeleton spawn logic - after 30 seconds
        const skeletonsUnlocked = elapsedTime >= 30
        if (skeletonsUnlocked) {
          const skeletonDifficultyLevel = Math.floor((elapsedTime - 30) / 10)
          const maxSkeletons = Math.floor((3 + skeletonDifficultyLevel * 2) * spawnMultiplier)
          const skeletonSpawnInterval = Math.max(2, 4 - skeletonDifficultyLevel * 0.3) * 1000

          if (
            now - lastSkeletonSpawnRef.current >= skeletonSpawnInterval &&
            skeletonsRef.current.length < maxSkeletons
          ) {
            const side = Math.floor(Math.random() * 4)
            let spawnX = 0,
              spawnY = 0
            const buffer = 50

            switch (side) {
              case 0:
                spawnX = Math.random() * canvas.width
                spawnY = -buffer
                break
              case 1:
                spawnX = canvas.width + buffer
                spawnY = Math.random() * canvas.height
                break
              case 2:
                spawnX = Math.random() * canvas.width
                spawnY = canvas.height + buffer
                break
              case 3:
                spawnX = -buffer
                spawnY = Math.random() * canvas.height
                break
            }

            skeletonsRef.current.push({
              id: Math.random(),
              x: spawnX,
              y: spawnY,
              speed: 90 + Math.random() * 30 + skeletonDifficultyLevel * 10,
              direction: Direction.DOWN,
              frameIndex: 0,
              tickCount: 0,
            })

            lastSkeletonSpawnRef.current = now
          }
        }

        // Wolf spawn logic - after 60 seconds
        const wolvesUnlocked = elapsedTime >= 60
        if (wolvesUnlocked) {
          const wolfDifficultyLevel = Math.floor((elapsedTime - 60) / 10)
          const maxWolves = Math.floor((2 + wolfDifficultyLevel * 2) * spawnMultiplier)
          const wolfSpawnInterval = Math.max(1.5, 3 - wolfDifficultyLevel * 0.3) * 1000

          if (now - lastWolfSpawnRef.current >= wolfSpawnInterval && wolvesRef.current.length < maxWolves) {
            const side = Math.floor(Math.random() * 4)
            let spawnX = 0,
              spawnY = 0
            const buffer = 50

            switch (side) {
              case 0:
                spawnX = Math.random() * canvas.width
                spawnY = -buffer
                break
              case 1:
                spawnX = canvas.width + buffer
                spawnY = Math.random() * canvas.height
                break
              case 2:
                spawnX = Math.random() * canvas.width
                spawnY = canvas.height + buffer
                break
              case 3:
                spawnX = -buffer
                spawnY = Math.random() * canvas.height
                break
            }

            wolvesRef.current.push({
              id: Math.random(),
              x: spawnX,
              y: spawnY,
              speed: 110 + Math.random() * 40 + wolfDifficultyLevel * 12,
              direction: 2,
              frameIndex: 0,
              tickCount: 0,
            })

            lastWolfSpawnRef.current = now
          }
        }

        // Player movement
        const { up, down, left, right } = inputRef.current
        let moving = false
        const moveAmount = config.speed * deltaTime

        if (up) {
          posRef.current.y = Math.max(0, posRef.current.y - moveAmount)
          directionRef.current = Direction.UP
          moving = true
        } else if (down) {
          posRef.current.y = Math.min(canvas.height, posRef.current.y + moveAmount)
          directionRef.current = Direction.DOWN
          moving = true
        }
        if (left) {
          posRef.current.x = Math.max(0, posRef.current.x - moveAmount)
          directionRef.current = Direction.LEFT
          moving = true
        } else if (right) {
          posRef.current.x = Math.min(canvas.width, posRef.current.x + moveAmount)
          directionRef.current = Direction.RIGHT
          moving = true
        }
        isMovingRef.current = moving

        if (!isAttackingRef.current) {
          if (moving) {
            tickRef.current++
            if (tickRef.current > config.animationSpeed) {
              tickRef.current = 0
              frameRef.current = (frameRef.current + 1) % config.cols
            }
          } else {
            frameRef.current = 0
            tickRef.current = 0
          }
        }

        // Update and draw zombies
        zombiesRef.current.forEach((zombie) => {
          const dx = posRef.current.x - zombie.x
          const dy = posRef.current.y - zombie.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist > 0) {
            zombie.x += (dx / dist) * zombie.speed * deltaTime
            zombie.y += (dy / dist) * zombie.speed * deltaTime
          }

          if (Math.abs(dx) > Math.abs(dy)) {
            zombie.direction = dx > 0 ? Direction.RIGHT : Direction.LEFT
          } else {
            zombie.direction = dy > 0 ? Direction.DOWN : Direction.UP
          }

          zombie.tickCount++
          if (zombie.tickCount > 10) {
            zombie.tickCount = 0
            zombie.frameIndex = (zombie.frameIndex + 1) % 4
          }

          if (dist < 30 && !isAttackingRef.current) {
            setGameState("GAME_OVER")
          }
        })

        // Update and draw skeletons
        skeletonsRef.current.forEach((skeleton) => {
          const dx = posRef.current.x - skeleton.x
          const dy = posRef.current.y - skeleton.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist > 0) {
            skeleton.x += (dx / dist) * skeleton.speed * deltaTime
            skeleton.y += (dy / dist) * skeleton.speed * deltaTime
          }

          if (Math.abs(dx) > Math.abs(dy)) {
            skeleton.direction = dx > 0 ? Direction.RIGHT : Direction.LEFT
          } else {
            skeleton.direction = dy > 0 ? Direction.DOWN : Direction.UP
          }

          skeleton.tickCount++
          if (skeleton.tickCount > 8) {
            skeleton.tickCount = 0
            skeleton.frameIndex = (skeleton.frameIndex + 1) % 4
          }

          if (dist < 30 && !isAttackingRef.current) {
            setGameState("GAME_OVER")
          }
        })

        // Update and draw wolves
        wolvesRef.current.forEach((wolf) => {
          const dx = posRef.current.x - wolf.x
          const dy = posRef.current.y - wolf.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist > 0) {
            wolf.x += (dx / dist) * wolf.speed * deltaTime
            wolf.y += (dy / dist) * wolf.speed * deltaTime
          }

          if (Math.abs(dx) > Math.abs(dy)) {
            wolf.direction = dx > 0 ? Direction.RIGHT : Direction.LEFT
          } else {
            wolf.direction = dy > 0 ? Direction.DOWN : Direction.UP
          }

          wolf.tickCount++
          if (wolf.tickCount > 6) {
            wolf.tickCount = 0
            wolf.frameIndex = (wolf.frameIndex + 1) % 4
          }

          if (dist < 30 && !isAttackingRef.current) {
            setGameState("GAME_OVER")
          }
        })

        // Collect all entities (player + monsters) with their render info
        const entities: Array<{
          y: number
          type: "player" | "zombie" | "skeleton" | "wolf"
          data?: any
        }> = []

        // Add player
        if (spriteSrc) {
          entities.push({
            y: posRef.current.y,
            type: "player",
          })
        }

        // Add zombies
        zombiesRef.current.forEach((zombie) => {
          entities.push({
            y: zombie.y,
            type: "zombie",
            data: zombie,
          })
        })

        // Add skeletons
        skeletonsRef.current.forEach((skeleton) => {
          entities.push({
            y: skeleton.y,
            type: "skeleton",
            data: skeleton,
          })
        })

        // Add wolves
        wolvesRef.current.forEach((wolf) => {
          entities.push({
            y: wolf.y,
            type: "wolf",
            data: wolf,
          })
        })

        // Sort by Y position (entities higher on screen drawn first)
        entities.sort((a, b) => a.y - b.y)

        // Draw entities in sorted order
        entities.forEach((entity) => {
          if (entity.type === "player") {
            const currentPlayerImg = isAttackingRef.current && attackImg.complete ? attackImg : playerImg

            if (currentPlayerImg.complete && currentPlayerImg.naturalWidth > 0) {
              const pFrameWidth = currentPlayerImg.width / config.cols
              const pFrameHeight = currentPlayerImg.height / config.rows
              const pSx = frameRef.current * pFrameWidth
              const pSy = directionRef.current * pFrameHeight
              const pDestW = pFrameWidth * config.scale
              const pDestH = pFrameHeight * config.scale

              ctx.drawImage(
                currentPlayerImg,
                pSx,
                pSy,
                pFrameWidth,
                pFrameHeight,
                posRef.current.x - pDestW / 2,
                posRef.current.y - pDestH / 2,
                pDestW,
                pDestH,
              )
            }
          } else if (entity.type === "zombie") {
            const zombie = entity.data
            if (zombieImg.complete && zombieImg.naturalWidth > 0) {
              const zFrameWidth = zombieImg.width / 4
              const zFrameHeight = zombieImg.height / 4
              const zSx = zombie.frameIndex * zFrameWidth
              const zSy = zombie.direction * zFrameHeight
              const zDestW = zFrameWidth * 0.6
              const zDestH = zFrameHeight * 0.6

              ctx.drawImage(
                zombieImg,
                zSx,
                zSy,
                zFrameWidth,
                zFrameHeight,
                zombie.x - zDestW / 2,
                zombie.y - zDestH / 2,
                zDestW,
                zDestH,
              )
            }
          } else if (entity.type === "skeleton") {
            const skeleton = entity.data
            if (skeletonImg.complete && skeletonImg.naturalWidth > 0) {
              const sFrameWidth = skeletonImg.width / 4
              const sFrameHeight = skeletonImg.height / 4
              const sSx = skeleton.frameIndex * sFrameWidth
              const sSy = skeleton.direction * sFrameHeight
              const sDestW = sFrameWidth * 0.6
              const sDestH = sFrameHeight * 0.6

              ctx.drawImage(
                skeletonImg,
                sSx,
                sSy,
                sFrameWidth,
                sFrameHeight,
                skeleton.x - sDestW / 2,
                skeleton.y - sDestH / 2,
                sDestW,
                sDestH,
              )
            }
          } else if (entity.type === "wolf") {
            const wolf = entity.data
            if (wolfImg.complete && wolfImg.naturalWidth > 0) {
              const wFrameWidth = wolfImg.width / 4
              const wFrameHeight = wolfImg.height / 4
              const wSx = wolf.frameIndex * wFrameWidth
              const wSy = wolf.direction * wFrameHeight
              const wDestW = wFrameWidth * 0.6
              const wDestH = wFrameHeight * 0.6

              ctx.drawImage(
                wolfImg,
                wSx,
                wSy,
                wFrameWidth,
                wFrameHeight,
                wolf.x - wDestW / 2,
                wolf.y - wDestH / 2,
                wDestW,
                wDestH,
              )
            }
          }
        })
      }

      if (gameState === "COUNTDOWN") {
        // Draw semi-transparent overlay
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw countdown number
        ctx.font = "bold 120px 'Press Start 2P', monospace"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = "#818cf8"
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 4
        ctx.strokeText(countdown.toString(), canvas.width / 2, canvas.height / 2)
        ctx.fillText(countdown.toString(), canvas.width / 2, canvas.height / 2)

        // Draw "GET READY" text
        ctx.font = "24px 'Press Start 2P', monospace"
        ctx.fillStyle = "#ffffff"
        ctx.fillText("GET READY", canvas.width / 2, canvas.height / 2 + 100)
      }

      animationFrameId = requestAnimationFrame(render)
    }

    const startLoop = () => {
      if (isMounted && !animationFrameId) {
        lastFrameTimeRef.current = 0
        animationFrameId = requestAnimationFrame(render)
      }
    }

    playerImg.onload = startLoop
    attackImg.onload = startLoop
    zombieImg.onload = startLoop
    skeletonImg.onload = startLoop
    wolfImg.onload = startLoop
    startLoop()

    return () => {
      isMounted = false
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [spriteSrc, zombieSrc, skeletonSrc, wolfSrc, attackSrc, gameState, countdown])

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full block" width={800} height={600} />

      {gameState === "PLAYING" && (
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-4 py-2 rounded-full border border-white/10 text-white font-pixel font-bold select-none pointer-events-none">
          Time: {score}s
        </div>
      )}

      {gameState === "PLAYING" && (
        <div className="absolute top-16 left-4 bg-black/50 backdrop-blur px-4 py-2 rounded-full border border-white/10 text-white font-pixel text-sm select-none pointer-events-none">
          <div className="flex gap-4">
            <span className="text-green-400">Zombies: {zombiesKilled}</span>
            {score >= 30 && <span className="text-purple-400">Skeletons: {skeletonsKilled}</span>}
            {score >= 60 && <span className="text-amber-400">Wolves: {wolvesKilled}</span>}
          </div>
        </div>
      )}

      {gameState === "PLAYING" && (
        <div className="absolute bottom-4 right-4 text-white/50 text-xs font-pixel pointer-events-none">
          PRESS SPACE TO ATTACK
        </div>
      )}

      {gameState === "GAME_OVER" && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center">
          <h2 className="text-6xl font-pixel font-bold text-red-500 mb-4 tracking-tight">YOU DIED</h2>
          <p className="text-xl font-pixel text-zinc-300 mb-8">You survived for {score} seconds</p>
          <div className="flex gap-8 mb-8">
            <span className="text-green-400 font-pixel">Zombies killed: {zombiesKilled}</span>
            {score >= 30 && <span className="text-purple-400 font-pixel">Skeletons killed: {skeletonsKilled}</span>}
            {score >= 60 && <span className="text-amber-400 font-pixel">Wolves killed: {wolvesKilled}</span>}
          </div>
          <div className="flex gap-4">
            <button
              onClick={initGameSequence}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-pixel font-bold text-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
