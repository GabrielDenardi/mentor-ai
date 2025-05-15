import { NextRequest, NextResponse } from 'next/server'

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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    })
    if (!res.ok) {
        const err = await res.text()
        return NextResponse.json({ error: err }, { status: res.status })
    }

    const data = await res.json()
    let raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]'
    raw = raw.trim().replace(/^```(?:json)?\s*/im, '').replace(/```$/m, '').trim()

    return NextResponse.json({
        reply: "Pronto! Seu cronograma de estudos está aqui. Clique no botão abaixo para visualizar.",
        plan: raw
    })
}
