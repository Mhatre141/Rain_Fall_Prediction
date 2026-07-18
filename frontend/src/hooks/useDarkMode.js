/**
 * useDarkMode — persists dark mode preference to localStorage
 */
import { useEffect, useState } from 'react'

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('rainsense-theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('rainsense-theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('rainsense-theme', 'light')
    }
  }, [isDark])

  return [isDark, setIsDark]
}
