import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
})

export async function GET(request: NextRequest) {
    const url = new URL(request.url)
    const subject = url.searchParams.get('subject') || 'Conteúdo'

    const prompt = `
Explique detalhadamente sobre "${subject}".  
Retorne **somente** um JSON puro no formato:

[
  { "topic": "Título do tópico 1", "explanation": "Texto explicativo completo..." },
  { "topic": "Título do tópico 2", "explanation": "Outro texto explicativo..." },
  …
]
`.trim()

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [{ parts: [{ text: prompt }] }],
        })

        let raw = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]'
        raw = raw
            .replace(/^```(?:json)?\s*/i, '')
            .replace(/\s*```$/i, '')
            .trim()

        let contents: { topic: string; explanation: string }[] = []
        try {
            contents = JSON.parse(raw)
        } catch {
            console.error('Falha no JSON parse:', raw)
        }

        return NextResponse.json({ contents })
    } catch (err: any) {
        console.error('Erro ao chamar Gemini em /api/conteudo:', err)
        return NextResponse.json({ contents: [] }, { status: 500 })
    }
}
