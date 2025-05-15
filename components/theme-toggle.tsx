"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Apenas renderize o botão depois que o componente for montado no cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-9 h-9"></div> // Espaço reservado para evitar layout shift
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="relative w-9 h-9 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-0 shadow-md hover:shadow-lg transition-all duration-200"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={resolvedTheme === "dark" ? "dark" : "light"}
          initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotate: 30 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {resolvedTheme === "dark" ? (
            <Moon className="h-4 w-4 text-blue-300" />
          ) : (
            <Sun className="h-4 w-4 text-yellow-500" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-full ${
          resolvedTheme === "dark" ? "bg-blue-400" : "bg-yellow-400"
        } opacity-0 blur-md`}
        animate={{
          opacity: [0, 0.15, 0],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
      />
    </Button>
  )
}
