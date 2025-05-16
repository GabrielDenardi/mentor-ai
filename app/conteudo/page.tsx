"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Lightbulb, CheckSquare, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

type PlanItem = { day: string; content: string; duration: number }
type Topic    = { topic: string; explanation: string }

export default function ContentScreen() {
    const [plan, setPlan]             = useState<PlanItem[]>([])
    const [planLoaded, setPlanLoaded] = useState(false)
    const [contents, setContents]     = useState<Topic[]>([])
    const [activeTab, setActiveTab]   = useState(0)
    const [isLoading, setLoading]     = useState(true)
    const [example, setExample]       = useState<string>("")
    const [isExampleLoading, setExampleLoading] = useState(false)

    useEffect(() => {
        const raw = localStorage.getItem("mentor-topics")
        if (raw) {
            try { setPlan(JSON.parse(raw)) } catch { setPlan([]) }
        }
        setPlanLoaded(true)
    }, [])

    useEffect(() => {
        if (!planLoaded) return
        if (plan.length === 0) { setLoading(false); return }

        const uniqueTopics = Array.from(new Set(plan.map(p => p.content)))
        const savedRaw = localStorage.getItem("mentor-explanations")
        let saved: Record<string,string> = {}
        if (savedRaw) { try { saved = JSON.parse(savedRaw) } catch {} }

        const missing = uniqueTopics.filter(t => !saved[t])
        if (missing.length === 0) {
            setContents(uniqueTopics.map(topic => ({ topic, explanation: saved[topic] })))
            setLoading(false)
            return
        }

        Promise.all(
            missing.map(topic =>
                fetch(`/api/conteudo?subject=${encodeURIComponent(topic)}`)
                    .then(r => r.json())
                    .then(({ contents }) => { saved[topic] = contents[0]?.explanation || "Sem explicação disponível." })
            )
        ).then(() => {
            localStorage.setItem("mentor-explanations", JSON.stringify(saved))
            setContents(uniqueTopics.map(topic => ({ topic, explanation: saved[topic] })))
        }).finally(() => setLoading(false))
    }, [plan, planLoaded])

    const handleExample = async () => {
        const text = contents[activeTab]?.explanation
        if (!text) return
        setExampleLoading(true)
        setExample("")
        try {
            const res = await fetch('/api/tirar-duvida', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: `Gere um exemplo do cotidiano para este texto:\n\n${text}` })
            })
            const { reply } = await res.json()
            setExample(reply.trim())
        } catch {
            setExample('Erro ao gerar exemplo.')
        } finally {
            setExampleLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400/10 via-purple-300/10 to-blue-400/10 dark:from-blue-900/20 dark:via-purple-800/10 dark:to-blue-900/20">
            <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm dark:shadow-gray-800/20 p-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center">
                    <Link href="/chat">
                        <Button variant="ghost" size="icon" className="mr-2 hover:scale-110 transition-transform duration-200">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center">
                        <motion.img src="/robot-mascot.png" alt="MentorIA mascot" className="h-8 w-8 mr-2" whileHover={{ rotate: 10, scale: 1.1 }} transition={{ duration: 0.2 }} />
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">MentorIA</h1>
                    </div>
                </div>
                <ThemeToggle />
            </motion.header>

            <div className="container mx-auto p-4 max-w-2xl">
                {isLoading ? (
                    <p className="text-center text-gray-500 mt-8">Carregando conteúdos…</p>
                ) : contents.length === 0 ? (
                    <p className="text-center text-gray-500 mt-8">Nenhum conteúdo encontrado.</p>
                ) : (
                    <>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <Card className="mb-6 overflow-hidden border-0 shadow-lg dark:shadow-gray-900/30 dark:bg-gray-800/50 backdrop-blur-sm">
                                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg p-6">
                                    <CardTitle className="text-2xl flex items-center">
                                        <motion.img src="/robot-mascot.png" alt="MentorIA mascot" className="h-8 w-8 mr-3" animate={{ rotate: [0, 10, 0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
                                        {contents[activeTab].topic}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-sm sm:text-base">
                                        {contents[activeTab].explanation}
                                    </motion.p>

                                    <div className="relative mb-4">
                                        <div className="flex overflow-x-auto space-x-3 py-1 no-scrollbar">
                                            {contents.map((c, i) => (
                                                <motion.button key={i} onClick={() => { setActiveTab(i); setExample("") }} className={`flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${activeTab === i ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    {c.topic}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.5 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
                                            <Button onClick={handleExample} disabled={isExampleLoading} className="w-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-800/60 text-blue-700 dark:text-blue-300 justify-start shadow-sm hover:shadow-md transition-all duration-200">
                                                <Lightbulb className="h-4 w-4 mr-2" />
                                                {isExampleLoading ? 'Gerando exemplo…' : 'Explicar com exemplo'}
                                            </Button>
                                        </motion.div>
                                    </div>

                                    {example && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <h3 className="font-semibold mb-2">Exemplo:</h3>
                                            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base whitespace-pre-wrap">{example}</p>
                                        </motion.div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    )
}
