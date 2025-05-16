"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, BookOpen, HelpCircle, FileText, Calendar } from "lucide-react"
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
}

export default function ChatScreen() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showPlanButton, setShowPlanButton] = useState(false)
  const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>([
    { id: 1, text: "Me ajude a estudar Matemática" },
    { id: 2, text: "Me ajude a estudar História" },
    { id: 3, text: "Me ajude a estudar Física" },
    { id: 4, text: "Me ajude a estudar Biologia" },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const [hasInitialMessage, setHasInitialMessage] = useState(false)
  const [subject, setSubject] = useState("")
  const [planJson, setPlanJson] = useState("")
  const LAST_SUBJECT_KEY = "mentoria-last-subject"

  useEffect(() => {
    setMounted(true)

    const last = localStorage.getItem(LAST_SUBJECT_KEY)
    if (last) {
      setSubject(last)
      setShowPlanButton(true)
      setMessages([
        {
          id: 1,
          sender: "ai",
          text: "Identifiquei que você já tem um plano de estudos salvo. Acesse-o abaixo:",
        },
      ])
      setHasInitialMessage(true)
      return
    }

    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages([
          {
            id: 1,
            sender: "ai",
            text: "Olá! Sou o MentorIA, seu assistente de estudos personalizado. Quantos dias faltam para sua prova? Em que matérias você tem mais dificuldade?",
          },
        ])
        setHasInitialMessage(true)
      }, 2000)
    }, 1000)
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

  const sendMessage = async (text: string) => {
    setSubject(text)
    localStorage.setItem(LAST_SUBJECT_KEY, text)

    setMessages(prev => [...prev, { id: prev.length+1, sender: 'user', text }])
    setIsTyping(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const { reply, plan, error } = await res.json()
      setIsTyping(false)
      if (error) throw new Error(error)

      localStorage.setItem("mentor-explanation", reply.trim())
      localStorage.setItem("mentor-topics", plan)

      setPlanJson(plan)

      setMessages(prev => [
        ...prev,
        { id: prev.length+1, sender: 'ai', text: reply },
      ])
      setShowPlanButton(true)

    } catch {
      setIsTyping(false)
      setMessages(prev => [
        ...prev,
        { id: prev.length+1, sender: 'ai', text: 'Desculpe, ocorreu um erro.' },
      ])
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question)
    setSuggestedQuestions((prev) => prev.filter((q) => q.text !== question))
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
        <Link href="/">
          <div className="flex items-center">
            <motion.img
              src="/robot-mascot.png"
              alt="MentorIA mascot"
              className="h-10 w-10 mr-3"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ duration: 0.2 }}
            />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              MentorIA
            </h1>
          </div>
        </Link>
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

        {messages.length < 2 && suggestedQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-4"
          >
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Sugestões de perguntas:</h3>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question) => (
                <motion.button
                  key={question.id}
                  onClick={() => handleSuggestedQuestion(question.text)}
                  className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {question.text}
                </motion.button>
              ))}
            </div>
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
                className={`max-w-[90%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-tr-none shadow-lg"
                    : "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 rounded-tl-none shadow-md dark:shadow-gray-900/30"
                }`}
              >
                {message.text}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
                key="typing"
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

          {showPlanButton && (
              <motion.div key="plan-button" className="flex justify-center my-4">
                <Link href={`/plano-estudos?subject=${encodeURIComponent(subject)}`}>
                  <Button className="…">
                    <Calendar className="mr-2 h-5 w-5" />
                    Visualizar plano de estudos
                  </Button>
                </Link>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
          <Link href="/tirar-duvida" className="w-full">
            <Button className="w-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-800/60 text-blue-700 dark:text-blue-300 hover:scale-105 transition-transform duration-200 flex items-center justify-center gap-2 shadow-sm dark:shadow-gray-900/30">
              <HelpCircle className="h-4 w-4" />
              <span>Tirar dúvida</span>
            </Button>
          </Link>
          <Link href={`/conteudo?subject=${encodeURIComponent(subject)}`} className="w-full">
            <Button className="w-full bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 dark:hover:bg-purple-800/60 text-purple-700 dark:text-purple-300 hover:scale-105 transition-transform duration-200 flex items-center justify-center gap-2 shadow-sm dark:shadow-gray-900/30">
              <BookOpen className="h-4 w-4" />
              <span>Revisar conteúdos</span>
            </Button>
          </Link>
          <Link href="/simulado" className="w-full">
            <Button className="w-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-800/60 text-blue-700 dark:text-blue-300 hover:scale-105 transition-transform duration-200 flex items-center justify-center gap-2 shadow-sm dark:shadow-gray-900/30">
              <FileText className="h-4 w-4" />
              <span>Gerar simulado</span>
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
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
