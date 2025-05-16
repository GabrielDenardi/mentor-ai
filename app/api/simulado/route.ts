import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

export async function POST(request: NextRequest) {
    const { topics } = (await request.json()) as { topics: string }
    const prompt = `
Gere um simulado de 5 questões em JSON com este formato:
[
  { "id": 1, "text": "Pergunta...", "options": ["A","B","C","D"], "correctAnswer": 2, "explanation": "…" },
  …
]
Com base nos tópicos: ${topics}
`.trim()

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ parts: [{ text: prompt }] }],
    })

    let raw = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]'
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/```$/m, '').trim()

    let questions = []
    try {
        questions = JSON.parse(raw)
    } catch (err) {
        console.error("Erro ao parsear JSON do simulado:", err)
    }

    return NextResponse.json({ questions })
}
