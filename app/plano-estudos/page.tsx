"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ArrowLeft,
  Download,
  CheckCircle,
  RefreshCw,
  BookOpen,
  Trophy,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { Progress } from "@/components/ui/progress"
import Confetti from "@/components/confetti"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { StudyPlanPDF } from "@/components/StudyPlanPDF"

type StudyItem = {
  id: number
  day: string
  content: string
  duration: number
  completed: boolean
}

export default function StudyPlanScreen() {
  const params = useSearchParams()
  const router = useRouter()
  const subject = params.get("subject") || ""

  const [mounted, setMounted] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState(true)
  const [progress, setProgress] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [celebrationVisible, setCelebrationVisible] = useState(false)
  const [studyPlan, setStudyPlan] = useState<StudyItem[]>([])

  type GroupedEntry = {
    content: string
    duration: number
    completed: boolean
  }

  const groupedPlan: Record<string, StudyItem[]> = {}
  studyPlan.forEach(item => {
    if (!groupedPlan[item.day]) groupedPlan[item.day] = []
    groupedPlan[item.day].push(item)
  })

  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>(
      () =>
          Object.keys(groupedPlan).reduce((acc, day) => {
            acc[day] = true
            return acc
          }, {} as Record<string, boolean>)
  )

  const toggleDay = (day: string) => {
    setExpandedDays(prev => ({ ...prev, [day]: !prev[day] }))
  }

  useEffect(() => {
    setMounted(true)
    if (!subject) {
      router.push("/chat")
      return
    }

    const storageKey = `mentoria-study-plan:${subject}`
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      setStudyPlan(JSON.parse(saved))
      setLoadingPlan(false)
      return
    }

    fetch("/api/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({message: subject}),
    })
        .then((res) => res.json())
        .then(({plan, error}) => {
          if (error) throw new Error(error)
          let raw = plan as string
          raw = raw
              .trim()
              .replace(/^```(?:json)?\s*/im, "")
              .replace(/```$/m, "")
              .trim()

          const arr = JSON.parse(raw) as {
            day: string
            content: string
            duration: number
          }[]

          const items: StudyItem[] = arr.map((item, i) => ({
            id: i + 1,
            day: item.day,
            content: item.content,
            duration: item.duration,
            completed: false,
          }))
          setStudyPlan(items)
        })
        .catch((err) => {
          console.error("Erro ao buscar plano:", err)
          setStudyPlan([])
        })
        .finally(() => {
          setLoadingPlan(false)
        })
  }, [subject, router]);

  useEffect(() => {
    if (mounted && !loadingPlan && studyPlan.length) {
      const completed = studyPlan.filter((i) => i.completed).length
      const pct = Math.round((completed / studyPlan.length) * 100)
      setProgress(pct)

      const storageKey = `mentoria-study-plan:${subject}`
      localStorage.setItem(storageKey, JSON.stringify(studyPlan))

      if (pct === 100 && !showConfetti) {
        setShowConfetti(true)
        setCelebrationVisible(true)
        setTimeout(() => setCelebrationVisible(false), 5_000)
      }
    }
  }, [studyPlan, mounted, loadingPlan, subject, showConfetti])

  const toggleCompleted = (id: number) => {
    setStudyPlan((prev) =>
        prev.map((item) =>
            item.id === id ? { ...item, completed: !item.completed } : item,
        ),
    )
  }

  const resetPlan = () => {
    setStudyPlan((prev) => prev.map((item) => ({ ...item, completed: false })))
    setShowConfetti(false)
    setCelebrationVisible(false)
  }

  if (!mounted || loadingPlan) {
    return (
        <div className="flex items-center justify-center h-screen">
          <p>Carregando seu plano de {subject}…</p>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400/10 via-purple-300/10 to-blue-400/10 dark:from-blue-900/20 dark:via-purple-800/10 dark:to-blue-900/20">
        {showConfetti && <Confetti />}

        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm dark:shadow-gray-800/20 p-4 flex items-center justify-between sticky top-0 z-10"
        >
          <div className="flex items-center">
            <Link href="/chat">
              <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2 hover:scale-110 transition-transform"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center">
              <motion.img
                  src="/robot-mascot.png"
                  alt="MentorIA"
                  className="h-8 w-8 mr-2"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
              />
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Plano de {subject}
              </h1>
            </div>
          </div>
          <ThemeToggle />
        </motion.header>

        <div className="container mx-auto p-4 max-w-2xl">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
          >
            <div id="cronograma-to-pdf">
            <Card className="mb-6 overflow-hidden border-0 shadow-lg dark:shadow-gray-900/30 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg p-6">
                <CardTitle className="text-2xl flex items-center">
                  Cronograma de Estudos
                </CardTitle>
              </CardHeader>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30">
                <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Progresso
                </span>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {progress}%
                </span>
                </div>
                <Progress
                    value={progress}
                    className="h-2 bg-blue-200 dark:bg-blue-800"
                    indicatorClassName="bg-blue-500 dark:bg-blue-400"
                />
                <p className="mt-3 text-center text-blue-600 dark:text-blue-300 font-medium">
                  {progress === 100
                      ? "Parabéns! Você completou todo o plano!"
                      : progress >= 50
                          ? "Ótimo ritmo! Continue assim."
                          : "Você consegue! Vamos em frente."}
                </p>
              </div>

              <CardContent className="p-0">
                <div className="divide-y dark:divide-gray-700">
                  {Object.entries(groupedPlan).map(([day, entries], dayIdx) => (
                      <div key={day}>
                        <motion.div
                            className="p-4 flex justify-between items-center cursor-pointer bg-white/80 dark:bg-gray-800/80"
                            onClick={() => toggleDay(day)}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: dayIdx * 0.05 }}
                        >
                          <div className="flex items-center">
                            <CheckCircle className="h-6 w-6 mr-3 text-blue-500" />
                            <h3 className="font-medium text-gray-800 dark:text-gray-200">
                              {day}
                            </h3>
                          </div>
                          <span className="text-sm text-blue-500">
            {expandedDays[day] ? "▾" : "▸"}
          </span>
                        </motion.div>

                        <AnimatePresence initial={false}>
                          {expandedDays[day] && (
                              <motion.div
                                  key="content"
                                  initial="collapsed"
                                  animate="open"
                                  exit="collapsed"
                                  variants={{
                                    open: { height: "auto", opacity: 1 },
                                    collapsed: { height: 0, opacity: 0 }
                                  }}
                                  transition={{ duration: 0.3, ease: "easeInOut" }}
                                  className="overflow-hidden"
                              >
                                {entries.map((item, idx) => (
                                    <motion.div
                                        key={item.id}
                                        className={`p-4 flex justify-between items-center cursor-pointer transition-colors duration-200 ${
                                            item.completed
                                                ? "bg-green-50/50 dark:bg-green-900/10"
                                                : "hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                                        }`}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.2, delay: idx * 0.03 }}
                                        onClick={() => toggleCompleted(item.id)}
                                    >
                                      <div className="flex items-center">
                                        <CheckCircle
                                            className={`h-6 w-6 mr-3 transition-all ${
                                                item.completed
                                                    ? "fill-green-500 text-white"
                                                    : "fill-transparent text-blue-500"
                                            }`}
                                        />
                                        <p
                                            className={`${
                                                item.completed
                                                    ? "line-through opacity-70 text-gray-400"
                                                    : "text-gray-600 dark:text-gray-400"
                                            }`}
                                        >
                                          {item.content}
                                        </p>
                                      </div>
                                      <span
                                          className={`inline-flex flex-shrink-0 items-center justify-center whitespace-nowrap rounded-full text-sm shadow-sm text-white w-16 py-1 ${
                                              item.completed
                                                  ? "bg-gray-400"
                                                  : "bg-gradient-to-r from-blue-400 to-blue-500 dark:from-blue-600 dark:to-blue-500"
                                          }`}
                                      >
                    {item.duration} min
                  </span>
                                    </motion.div>
                                ))}
                              </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            </div>
          </motion.div>

          <AnimatePresence>
            {celebrationVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    className="mb-6"
                >
                  <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center">
                        <Trophy className="h-8 w-8 mr-3 text-yellow-100"/>
                        <div>
                          <h3 className="text-xl font-bold">Missão cumprida!</h3>
                          <p className="text-yellow-100">
                            Você completou 100% do plano de {subject}!
                          </p>
                        </div>
                      </div>
                      <Button
                          variant="outline"
                          className="border-yellow-100 text-yellow-100 hover:bg-yellow-500 hover:text-white"
                          onClick={() => setCelebrationVisible(false)}
                      >
                        Fechar
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <Button asChild className="w-full">
              <PDFDownloadLink
                  document={<StudyPlanPDF plan={studyPlan} subject={subject} />}
                  fileName={`Plano de ${subject}.pdf`}
              >
                {({ loading }) =>
                    loading
                        ? "Gerando PDF…"
                        : (
                            <>
                              <Download className="mr-2 h-5 w-5" />
                              Exportar PDF
                            </>
                        )
                }
              </PDFDownloadLink>
            </Button>

            <Button
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-200 py-3"
                onClick={resetPlan}
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Reiniciar
            </Button>

            <Link href="/chat" className="w-full">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-md hover:shadow-lg transition-all duration-200 py-3">
                <BookOpen className="mr-2 h-5 w-5" />
                Nova Matéria
              </Button>
            </Link>
          </div>
        </div>
      </div>
  )
}
