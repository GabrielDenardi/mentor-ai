import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
})

export async function POST(request: NextRequest) {
    const { message } = (await request.json()) as { message: string }

    const prompt = `
Você é o MentorIA, um assistente de estudos.  
O usuário perguntou: "${message}".  
Responda de forma clara e objetiva.  
`.trim()

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{ parts: [{ text: prompt }] }],
        })

        const answer = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "Desculpe, não entendi."
        return NextResponse.json({ reply: answer })
    } catch (err: any) {
        console.error("Erro ao chamar o Gemini:", err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
