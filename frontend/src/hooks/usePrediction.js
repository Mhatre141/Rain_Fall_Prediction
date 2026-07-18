/**
 * usePrediction — handles prediction API call with loading and error state
 */
import { useState, useCallback } from 'react'
import { predictRain } from '@/services/api'

export function usePrediction() {
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const predict = useCallback(async (inputs) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await predictRain(inputs)
      setResult(data)
      return data
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return { result, loading, error, predict, reset }
}
