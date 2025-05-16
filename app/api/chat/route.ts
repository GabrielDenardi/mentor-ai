import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
})

export async function POST(request: NextRequest) {
    const { message } = (await request.json()) as { message: string }

    const prompt = `
Você é o MentorIA, um assistente de estudos.  
O usuário disse: "${message}".  
Gere um cronograma de estudos para **7 dias** em JSON puro, no formato:

[
  { "day": "Segunda-feira", "content": "Tópico", "duration": 45 },
  { "day": "Terça-feira",   "content": "Tópico", "duration": 60 },
  …  
]

Não inclua nenhum texto extra, só o array JSON.
  `.trim()

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{ parts: [{ text: prompt }] }],
        })

        let raw = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]'
        raw = raw.trim()
            .replace(/^```(?:json)?\s*/im, '')
            .replace(/```$/m, '')
            .trim()

        return NextResponse.json({
            reply: "Pronto! Seu cronograma de estudos está aqui. Clique no botão abaixo para visualizar.",
            plan: raw
        })
    } catch (err: any) {
        console.error("Erro ao chamar o Gemini:", err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
