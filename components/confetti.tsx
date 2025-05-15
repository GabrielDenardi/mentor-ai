"use client"

import { useEffect, useState } from "react"
import ReactConfetti from "react-confetti"

export default function Confetti() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    // Atualizar tamanho da janela
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Adicionar event listener
    window.addEventListener("resize", handleResize)

    // Parar os confetes após alguns segundos
    const timer = setTimeout(() => {
      setIsActive(false)
    }, 8000)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timer)
    }
  }, [])

  if (!isActive) return null

  return (
    <ReactConfetti
      width={windowSize.width}
      height={windowSize.height}
      recycle={false}
      numberOfPieces={500}
      gravity={0.15}
      colors={[
        "#3B82F6", // blue-500
        "#8B5CF6", // violet-500
        "#EC4899", // pink-500
        "#10B981", // emerald-500
        "#F59E0B", // amber-500
        "#6366F1", // indigo-500
      ]}
      className="fixed inset-0 z-50 pointer-events-none"
    />
  )
}
