/**
 * useHistory — manages prediction history in localStorage
 */
import { useState, useCallback } from 'react'

const STORAGE_KEY = 'rainsense-history'
const MAX_ENTRIES = 20

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function useHistory() {
  const [history, setHistory] = useState(load)

  const addEntry = useCallback((inputs, result) => {
    setHistory((prev) => {
      const entry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        inputs,
        result,
      }
      const updated = [entry, ...prev].slice(0, MAX_ENTRIES)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setHistory([])
  }, [])

  return { history, addEntry, clearHistory }
}
