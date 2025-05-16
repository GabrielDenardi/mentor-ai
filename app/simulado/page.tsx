"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, BookOpen } from "lucide-react"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

type Question = {
  id: number
  text: string
  options: string[]
  correctAnswer: number
  userAnswer?: number
  explanation: string
}

export default function SimuladoScreen() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setMounted(true)

    // 1) tenta carregar do localStorage
    const stored = localStorage.getItem("mentor-simulado-questions")
    if (stored) {
      const parsed: Question[] = JSON.parse(stored)
      setQuestions(parsed)
      setProgress((1 / parsed.length) * 100)
      setLoading(false)
      return
    }

    // 2) se não tiver, tenta regenerar a partir dos tópicos
    const topics = localStorage.getItem("mentor-topics")
    if (topics) {
      fetch("/api/simulado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topics }),
      })
          .then((res) => res.json())
          .then(({ questions }: { questions: Question[] }) => {
            setQuestions(questions)
            setProgress((1 / questions.length) * 100)
            localStorage.setItem("mentor-simulado-questions", JSON.stringify(questions))
          })
          .catch((err) => console.error("Erro ao gerar simulado:", err))
          .finally(() => setLoading(false))
    } else {
      // sem tópicos, não há como gerar
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!loading && questions.length > 0) {
      setProgress(((currentQuestion + 1) / questions.length) * 100)
    }
  }, [currentQuestion, questions.length, loading])

  const handleAnswer = (optionIndex: number) => {
    if (answered) return
    const updated = [...questions]
    updated[currentQuestion].userAnswer = optionIndex
    setQuestions(updated)
    setAnswered(true)
    if (optionIndex === questions[currentQuestion].correctAnswer) {
      setScore((s) => s + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1)
      setAnswered(false)
    } else {
      setShowResults(true)
    }
  }

  const resetSimulado = () => {
    localStorage.removeItem("mentor-simulado-questions")
    const reset = questions.map((q) => ({ ...q, userAnswer: undefined }))
    setQuestions(reset)
    setCurrentQuestion(0)
    setShowResults(false)
    setScore(0)
    setAnswered(false)
    setProgress((1 / reset.length) * 100)
  }

  if (!mounted || loading) {
    return (
        <div className="flex items-center justify-center h-screen">
          <p>Gerando simulado…</p>
        </div>
    )
  }

  if (questions.length === 0) {
    return (
        <div className="p-6 text-center">
          <p>Não há simulado disponível. Volte ao chat para gerar um plano primeiro.</p>
          <Link href="/chat">
            <Button className="mt-4">Voltar ao chat</Button>
          </Link>
        </div>
    )
  }


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
        {!showResults ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            key="question-card"
          >
            <Card className="mb-6 overflow-hidden border-0 shadow-lg dark:shadow-gray-900/30 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white p-6">
                <div className="flex justify-between items-center mb-2">
                  <CardTitle className="text-xl">Simulado Rápido</CardTitle>
                  <span className="text-sm font-medium">
                    Questão {currentQuestion + 1} de {questions.length}
                  </span>
                </div>
                <Progress value={progress} className="h-2 bg-blue-600/30" indicatorClassName="bg-white" />
              </CardHeader>

              <CardContent className="p-6">
                <h3 className="text-base sm:text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
                  {questions[currentQuestion].text}
                </h3>

                <RadioGroup className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 p-2 sm:p-3 rounded-lg border text-sm sm:text-base ${
                        answered
                          ? index === questions[currentQuestion].correctAnswer
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                            : index === questions[currentQuestion].userAnswer
                              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                              : "border-gray-200 dark:border-gray-700"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      } transition-colors duration-200 cursor-pointer`}
                      onClick={() => handleAnswer(index)}
                    >
                      <RadioGroupItem
                        value={index.toString()}
                        id={`option-${index}`}
                        disabled={answered}
                        checked={questions[currentQuestion].userAnswer === index}
                      />
                      <Label
                        htmlFor={`option-${index}`}
                        className={`flex-grow cursor-pointer ${
                          answered && index === questions[currentQuestion].correctAnswer
                            ? "text-green-700 dark:text-green-400 font-medium"
                            : answered && index === questions[currentQuestion].userAnswer
                              ? "text-red-700 dark:text-red-400"
                              : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {option}
                      </Label>

                      {answered && index === questions[currentQuestion].correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 ml-2" />
                      )}

                      {answered &&
                        index === questions[currentQuestion].userAnswer &&
                        index !== questions[currentQuestion].correctAnswer && (
                          <XCircle className="h-5 w-5 text-red-500 dark:text-red-400 ml-2" />
                        )}
                    </div>
                  ))}
                </RadioGroup>

                {answered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                  >
                    <p className="text-blue-700 dark:text-blue-300 font-medium">Explicação:</p>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">{questions[currentQuestion].explanation}</p>
                  </motion.div>
                )}
              </CardContent>

              <CardFooter className="p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                <Button
                  onClick={nextQuestion}
                  disabled={!answered}
                  className={`${
                    answered
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {currentQuestion < questions.length - 1 ? "Próxima pergunta" : "Ver resultados"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            key="results-card"
          >
            <Card className="mb-6 overflow-hidden border-0 shadow-lg dark:shadow-gray-900/30 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white p-6 text-center">
                <CardTitle className="text-2xl">Resultado do Simulado</CardTitle>
              </CardHeader>

              <CardContent className="p-6 text-center">
                <div className="mb-6">
                  <div className="text-4xl sm:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {score}/{questions.length}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Você acertou {score} de {questions.length} questões
                  </p>
                </div>

                <div className="mb-6">
                  <Progress
                    value={(score / questions.length) * 100}
                    className="h-4 bg-gray-200 dark:bg-gray-700"
                    indicatorClassName={`${
                      score / questions.length >= 0.7
                        ? "bg-green-500 dark:bg-green-600"
                        : score / questions.length >= 0.4
                          ? "bg-yellow-500 dark:bg-yellow-600"
                          : "bg-red-500 dark:bg-red-600"
                    }`}
                  />
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-6">
                  <p className="text-blue-700 dark:text-blue-300 font-medium">
                    {score / questions.length >= 0.7
                      ? "Parabéns! Você está indo muito bem."
                      : score / questions.length >= 0.4
                        ? "Bom trabalho! Continue praticando para melhorar."
                        : "Não desanime! Vamos revisar os conteúdos que você teve dificuldade."}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 text-left">Recomendações:</h3>
                  <ul className="text-left space-y-2">
                    {score < questions.length && (
                      <li className="flex items-start">
                        <BookOpen className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Revise os conteúdos:{" "}
                          {questions
                            .filter((q, i) => q.userAnswer !== q.correctAnswer)
                            .map((q, i, arr) => {
                              const topic = q.text.split(" ").slice(0, 3).join(" ") + "..."
                              return i === arr.length - 1 ? topic : topic + ", "
                            })}
                        </span>
                      </li>
                    )}
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Pratique mais simulados para fixar o conteúdo.
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-between">
                <Link href="/chat">
                  <Button variant="outline">Voltar ao chat</Button>
                </Link>
                <Button
                  onClick={resetSimulado}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 dark:from-blue-600 dark:to-purple-700 dark:hover:from-blue-500 dark:hover:to-purple-600 text-white"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refazer simulado
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
