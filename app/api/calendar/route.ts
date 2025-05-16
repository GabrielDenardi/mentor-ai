import { google } from "googleapis"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || !(session as any).accessToken) {
        return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })
    }

    const accessToken = (session as any).accessToken

    const { plan, startDate } = await req.json()

    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: accessToken })

    const calendar = google.calendar({ version: "v3", auth })

    const dayMap: Record<string, number> = {
        Domingo: 0, "Segunda-feira": 1, "Terça-feira": 2,
        "Quarta-feira": 3, "Quinta-feira": 4,
        "Sexta-feira": 5, Sábado: 6,
    }

    const weekStart = new Date(startDate)

    try {
        for (const item of plan) {
            const weekday = dayMap[item.day] ?? 1
            const eventDate = new Date(weekStart)
            eventDate.setDate(weekStart.getDate() + (weekday - 1))

            const start = new Date(eventDate)
            start.setHours(9, 0)
            const end = new Date(start)
            end.setMinutes(start.getMinutes() + item.duration)

            await calendar.events.insert({
                calendarId: "primary",
                requestBody: {
                    summary: item.content,
                    start: { dateTime: start.toISOString() },
                    end: { dateTime: end.toISOString() },
                },
            })
        }

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error("Erro ao criar eventos no Google Calendar:", err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
