import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "MentorIA - Seu assistente de estudos",
    description: "Estude com quem entende você",
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
        <head>
            <meta name="color-scheme" content="light dark" />
        </head>
        <body className={`${inter.className} antialiased`}>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    )
}
