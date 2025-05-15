"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import { Sparkles } from "lucide-react"

export default function WelcomeScreen() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400/10 via-purple-300/10 to-blue-400/10 dark:from-blue-900/20 dark:via-purple-800/10 dark:to-blue-900/20 p-4 overflow-hidden">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-10 w-72 h-72 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-blue-300 dark:bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence>
          {mounted &&
            Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-blue-400/30 dark:bg-blue-500/30"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: Math.random() * 0.5 + 0.5,
                  opacity: Math.random() * 0.3 + 0.1,
                }}
                animate={{
                  y: [null, Math.random() * -100 - 50],
                  opacity: [null, 0],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                style={{
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                }}
              />
            ))}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-md mx-auto text-center relative z-10 px-4">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6"
        >
          <motion.div
            className="relative mx-auto h-40 w-40 sm:h-48 sm:w-48 md:h-60 md:w-60"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onTouchStart={() => setIsHovering(true)}
            onTouchEnd={() => setIsHovering(false)}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 dark:from-blue-400/20 dark:to-purple-400/20 backdrop-blur-md"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 3,
                ease: "easeInOut",
              }}
            ></motion.div>

            <motion.div
              className="relative z-10 mx-auto h-40 w-40 sm:h-48 sm:w-48 md:h-60 md:w-60 drop-shadow-xl"
              animate={{
                y: [0, -10, 0],
                rotate: isHovering ? [0, -5, 5, -5, 0] : 0,
              }}
              transition={{
                y: {
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3,
                  ease: "easeInOut",
                },
                rotate: {
                  duration: 0.5,
                  ease: "easeInOut",
                },
              }}
            >
              <img src="/robot-mascot.png" alt="MentorIA mascot" className="w-full h-full object-contain" />

              <AnimatePresence>
                {isHovering && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute -top-2 -right-2 text-yellow-400"
                    >
                      <Sparkles className="h-6 w-6" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="absolute top-10 -left-4 text-blue-400"
                    >
                      <Sparkles className="h-5 w-5" />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2 w-full"
        >
          MentorIA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-base sm:text-lg md:text-xl text-purple-700 dark:text-purple-300 mb-8 sm:mb-10"
        >
          Estude com quem entende você
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Link href="/chat">
            <Button className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 dark:from-blue-600 dark:to-purple-700 dark:hover:from-blue-500 dark:hover:to-purple-600 text-white font-medium py-3 sm:py-4 md:py-6 px-6 sm:px-8 md:px-10 rounded-full text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl group w-full sm:w-auto">
              <span className="relative z-10">Começar agora</span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-purple-700/40"
                initial={{ x: "100%", opacity: 0 }}
                whileHover={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span className="absolute -inset-1 rounded-full blur-md bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            </Button>
          </Link>

          <motion.div
            className="absolute -inset-4 bg-blue-500 rounded-full opacity-0 blur-xl"
            animate={{ opacity: [0, 0.1, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </motion.div>
      </div>
    </div>
  )
}
