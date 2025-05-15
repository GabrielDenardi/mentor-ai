"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Send, Scissors, Lightbulb, CheckSquare, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"

type Message = {
  id: number
  sender: "user" | "ai"
  text: string
}

type SuggestedQuestion = {
  id: number
  text: string
  prefix?: string
}

export default function TirarDuvidaScreen() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [showExtendedOptions, setShowExtendedOptions] = useState(false)
  const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>([
    { id: 1, text: "Explique derivadas como se eu tivesse 10 anos", prefix: "Explique" },
    { id: 2, text: "Qual a fórmula da energia cinética?", prefix: "Qual a fórmula" },
    { id: 3, text: "Resuma fotossíntese em 5 tópicos", prefix: "Resuma" },
    { id: 4, text: "Por que a Revolução Industrial foi importante?", prefix: "Por que" },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)

    setTimeout(() => {
      setIsTyping(true)

      setTimeout(() => {
        setIsTyping(false)
        setMessages([
          {
            id: 1,
            sender: "ai",
            text: "Olá! Estou aqui para tirar suas dúvidas. Sobre qual assunto você gostaria de aprender hoje?",
          },
        ])
      }, 1500)
    }, 500)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      sendMessage(input)
      setInput("")
    }
  }

  const sendMessage = (text: string) => {
    const newMessage = { id: messages.length + 1, sender: "user", text }
    setMessages((prev) => [...prev, newMessage])
    setIsTyping(true)
    setShowSuggestions(false)

    setTimeout(() => {
      setIsTyping(false)

      if (text.toLowerCase().includes("derivada")) {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: "ai",
            text: "Derivada é como medir a velocidade de um carro a cada segundo. É usada para saber como uma coisa muda em relação a outra.\n\nPense assim: se você está dirigindo, o velocímetro mostra sua velocidade naquele instante exato - isso é uma derivada! Ele mostra como sua posição está mudando em relação ao tempo.\n\nNa matemática, escrevemos como f'(x) ou df/dx, que significa 'taxa de variação de f em relação a x'.\n\nPor exemplo, se f(x) = x², então f'(x) = 2x, que nos diz como a função está crescendo em cada ponto.",
          },
        ])
        setShowExtendedOptions(true)
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: "ai",
            text: "Entendi sua dúvida! Vou explicar de forma simples:\n\n" + generateSimpleResponse(text),
          },
        ])
        setShowExtendedOptions(true)
      }
    }, 2000)
  }

  const generateSimpleResponse = (question: string) => {
    return "Este conceito é fundamental para entender como as coisas funcionam no mundo. Pense nele como uma ferramenta que nos ajuda a resolver problemas e entender fenômenos.\n\nNo dia a dia, você pode observar exemplos como quando observa mudanças no clima ou quando calcula quanto tempo levará para chegar a um destino.\n\nA aplicação prática deste conhecimento está em várias áreas, desde engenharia até economia e ciências naturais."
  }

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const handlePrefixClick = (prefix: string) => {
    setInput(prefix + " ")
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const handleExtendedOption = (option: string) => {
    setIsTyping(true)
    setShowExtendedOptions(false)

    setTimeout(() => {
      setIsTyping(false)

      let responseText = ""

      if (option === "simpler") {
        responseText =
          "Vamos simplificar ainda mais:\n\nDerivada é como ver quão rápido algo está mudando.\n\nSe você enche um balde com água, a derivada é quão rápido o nível da água está subindo.\n\nSe você anda de bicicleta, a derivada é sua velocidade - quão rápido sua posição muda.\n\nÉ basicamente uma forma matemática de medir 'quão rápido' algo está acontecendo em um momento específico."
      } else if (option === "example") {
        responseText =
          "Aqui está um exemplo do cotidiano:\n\nQuando você esquenta água para fazer café, a temperatura sobe. A derivada é quão rápido essa temperatura está subindo a cada momento.\n\nNo início, a água esquenta rápido (derivada alta).\nDepois de um tempo, esquenta mais devagar (derivada menor).\nQuando começa a ferver, a temperatura para de subir (derivada zero).\n\nOutro exemplo: quando você freia o carro, a derivada da velocidade (que chamamos de aceleração) é negativa, mostrando que você está desacelerando."
      } else if (option === "quiz") {
        responseText =
          "Vamos testar seu conhecimento com um mini-quiz sobre derivadas:\n\n1. Se uma função representa a posição de um objeto, o que sua derivada representa?\na) Velocidade\nb) Massa\nc) Temperatura\n\n2. Se f(x) = 3x², qual é f'(x)?\na) 6x\nb) 3x\nc) 9x²\n\n3. Quando a derivada de uma função é zero em um ponto, isso significa que:\na) A função está crescendo rapidamente\nb) A função não está mudando naquele ponto\nc) A função não existe naquele ponto\n\n(As respostas corretas são: 1-a, 2-a, 3-b)"
      }

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "ai",
          text: responseText,
        },
      ])

      setShowExtendedOptions(true)
    }, 2000)
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-400/10 via-purple-300/10 to-blue-400/10 dark:from-blue-900/20 dark:via-purple-800/10 dark:to-blue-900/20">
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
              Tirar Dúvida
            </h1>
          </div>
        </div>
        <ThemeToggle />
      </motion.header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
          <div
            className="absolute inset-0 bg-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${resolvedTheme === "dark" ? "4B5563" : "6B7280"}' fillOpacity='0.2' fillRule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3Ccircle cx='13' cy='13' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-4"
          >
            <Card className="border-0 shadow-md dark:shadow-gray-900/30 dark:bg-gray-800/50 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-4">
                <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-3">Experimente perguntar:</h3>
                <div className="grid grid-cols-1 gap-2">
                  {suggestedQuestions.map((question) => (
                    <motion.button
                      key={question.id}
                      onClick={() => handleSuggestedQuestion(question.text)}
                      className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-3 rounded-lg text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200 text-left shadow-sm flex items-center"
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Sparkles className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                      {question.text}
                    </motion.button>
                  ))}
                </div>

                <div className="mt-4">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Ou comece com:</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(suggestedQuestions.map((q) => q.prefix))).map((prefix, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handlePrefixClick(prefix!)}
                        className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {prefix}...
                      </motion.button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {message.sender === "ai" && (
                <motion.div
                  className="mr-2 mt-1"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <img src="/robot-mascot.png" alt="AI" className="w-8 h-8" />
                </motion.div>
              )}
              <div
                className={`max-w-[90%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl text-sm sm:text-base ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-tr-none shadow-lg"
                    : "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 rounded-tl-none shadow-md dark:shadow-gray-900/30"
                }`}
              >
                {message.text.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < message.text.split("\n").length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="mr-2 mt-1"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <img src="/robot-mascot.png" alt="AI" className="w-8 h-8" />
              </motion.div>
              <div className="max-w-[80%] p-4 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 rounded-tl-none shadow-md dark:shadow-gray-900/30">
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </motion.div>
          )}

          {showExtendedOptions && messages.length > 0 && messages[messages.length - 1].sender === "ai" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="ml-0 sm:ml-10 mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2"
            >
              <motion.button
                onClick={() => handleExtendedOption("simpler")}
                className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-lg text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200 shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Scissors className="h-4 w-4 flex-shrink-0" />
                <span>Reescrever mais simples</span>
              </motion.button>

              <motion.button
                onClick={() => handleExtendedOption("example")}
                className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 px-3 py-2 rounded-lg text-sm hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors duration-200 shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Lightbulb className="h-4 w-4 flex-shrink-0" />
                <span>Exemplo do cotidiano</span>
              </motion.button>

              <motion.button
                onClick={() => handleExtendedOption("quiz")}
                className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 px-3 py-2 rounded-lg text-sm hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors duration-200 shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckSquare className="h-4 w-4 flex-shrink-0" />
                <span>Fazer quiz sobre isso</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg dark:shadow-gray-800/20"
      >
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua dúvida..."
            className="flex-1 bg-gray-100/80 dark:bg-gray-800/50 backdrop-blur-sm border-0 focus-visible:ring-blue-500 dark:text-gray-200 dark:placeholder:text-gray-400"
          />
          <Button
            type="submit"
            size="icon"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 dark:from-blue-600 dark:to-purple-700 dark:hover:from-blue-500 dark:hover:to-purple-600 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 relative group"
          >
            <Send className="h-5 w-5 relative z-10" />
            <motion.span
              className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-25 bg-white dark:bg-blue-400"
              animate={{ scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
