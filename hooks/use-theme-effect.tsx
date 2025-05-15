"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

// Este hook ajuda a prevenir o flash de tema incorreto durante a hidratação
export function useThemeEffect() {
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    // Adiciona a classe no-transition para evitar transições durante a mudança de tema
    const html = document.documentElement
    html.classList.add("no-transition")

    // Detecta a preferência do sistema
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

    // Verifica se há um tema salvo no localStorage
    const savedTheme = localStorage.getItem("mentoria-theme")

    // Define o tema com base na preferência salva ou do sistema
    if (savedTheme === "dark" || (savedTheme === null && systemTheme === "dark")) {
      setTheme("dark")
    } else {
      setTheme("light")
    }

    // Remove a classe no-transition após um pequeno atraso
    setTimeout(() => {
      html.classList.remove("no-transition")
    }, 100)

    // Adiciona um listener para mudanças na preferência do sistema
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (!savedTheme) {
        setTheme(mediaQuery.matches ? "dark" : "light")
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [setTheme])

  return resolvedTheme
}
