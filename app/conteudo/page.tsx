"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Lightbulb, CheckSquare, Scissors } from "lucide-react"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ContentScreen() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400/10 via-purple-300/10 to-blue-400/10 dark:from-blue-900/20 dark:via-purple-800/10 dark:to-blue-900/20">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm dark:shadow-gray-800/20 p-4 flex items-center justify-between sticky top-0 z-10"
      >
        <div className="flex items-center">
          <Link href="/chat">
            <Button variant="ghost" size="icon" className="mr-2 hover:scale-110 transition-transform duration-200">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center">
            <motion.img
              src="/robot-mascot.png"
              alt="MentorIA mascot"
              className="h-8 w-8 mr-2"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ duration: 0.2 }}
            />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              MentorIA
            </h1>
          </div>
        </div>
        <ThemeToggle />
      </motion.header>

      <div className="container mx-auto p-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="mb-6 overflow-hidden border-0 shadow-lg dark:shadow-gray-900/30 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white rounded-t-lg p-6">
              <CardTitle className="text-2xl flex items-center">
                <motion.img
                  src="/robot-mascot.png"
                  alt="MentorIA mascot"
                  className="h-8 w-8 mr-3"
                  animate={{
                    rotate: [0, 10, 0, -10, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                Fotossíntese
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-sm sm:text-base"
              >
                A fotossíntese é o processo pelo qual plantas, algas e algumas bactérias convertem luz solar, água e
                dióxido de carbono em glicose e oxigênio. Este processo é fundamental para a vida na Terra, pois produz
                oxigênio e serve como base da cadeia alimentar.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-sm sm:text-base"
              >
                O processo ocorre principalmente nas folhas, dentro de organelas chamadas cloroplastos, que contêm a
                clorofila - o pigmento verde que absorve a luz solar. A fotossíntese acontece em duas fases principais:
                a fase clara (dependente de luz) e a fase escura (independente de luz, também chamada de Ciclo de
                Calvin).
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-sm sm:text-base"
              >
                A equação simplificada da fotossíntese é:
                <span className="block text-center my-2 font-medium">
                  6 CO₂ + 6 H₂O + Energia luminosa → C₆H₁₂O₆ + 6 O₂
                </span>
                Onde CO₂ é o dióxido de carbono, H₂O é a água, C₆H₁₂O₆ é a glicose e O₂ é o oxigênio.
              </motion.p>

              {/* Interactive tabs */}
              <div className="flex mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {["Resumo", "Fases", "Importância"].map((tab, index) => (
                  <motion.button
                    key={index}
                    className={`flex-1 py-2 px-1 sm:px-2 rounded-md relative text-xs sm:text-sm md:text-base ${
                      activeTab === index
                        ? "text-white"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    }`}
                    onClick={() => setActiveTab(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {activeTab === index && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-md"
                        layoutId="activeTab"
                        transition={{ type: "spring", duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{tab}</span>
                  </motion.button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-3">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button className="w-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-800/60 text-blue-700 dark:text-blue-300 justify-start shadow-sm hover:shadow-md transition-all duration-200">
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Fazer quiz sobre isso
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button className="w-full bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 dark:hover:bg-purple-800/60 text-purple-700 dark:text-purple-300 justify-start shadow-sm hover:shadow-md transition-all duration-200">
                    <Scissors className="h-4 w-4 mr-2" />
                    Reescrever mais simples
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button className="w-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-800/60 text-blue-700 dark:text-blue-300 justify-start shadow-sm hover:shadow-md transition-all duration-200">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Explicar com exemplo
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <img
              src="/fotossintese-diagram.png"
              alt="Diagrama de fotossíntese"
              className="rounded-lg shadow-lg dark:shadow-gray-900/50"
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
