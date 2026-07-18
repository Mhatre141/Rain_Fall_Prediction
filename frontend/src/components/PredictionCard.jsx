/**
 * PredictionCard — 3-field input form with inline validation and loading state
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Thermometer, Droplets, Wind, ArrowRight, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import { usePrediction } from '@/hooks/usePrediction'
import ResultCard from './ResultCard'

const FIELDS = [
  {
    id:          'temperature',
    key:         'temperature',
    label:       'Avg Temperature',
    icon:        Thermometer,
    placeholder: 'e.g. 24',
    unit:        '°C',
    min:         -50,
    max:         60,
    hint:        'Between −50 °C and 60 °C',
  },
  {
    id:          'humidity',
    key:         'humidity',
    label:       'Avg Humidity',
    icon:        Droplets,
    placeholder: 'e.g. 68',
    unit:        '%',
    min:         0,
    max:         100,
    hint:        'Between 0 % and 100 %',
  },
  {
    id:          'wind_speed',
    key:         'wind_speed',
    label:       'Avg Wind Speed',
    icon:        Wind,
    placeholder: 'e.g. 15',
    unit:        'km/h',
    min:         0,
    max:         160,
    hint:        'Between 0 and 160 km/h',
  },
]

function validate(values) {
  const errors = {}
  FIELDS.forEach(({ key, min, max, label }) => {
    const v = parseFloat(values[key])
    if (values[key] === '' || isNaN(v)) {
      errors[key] = `${label} is required.`
    } else if (v < min || v > max) {
      errors[key] = `Must be between ${min} and ${max}.`
    }
  })
  return errors
}

export default function PredictionCard({ onResult }) {
  const [values, setValues]   = useState({ temperature: '', humidity: '', wind_speed: '' })
  const [touched, setTouched] = useState({})
  const [errors, setErrors]   = useState({})
  const { loading, result, error, predict, reset } = usePrediction()

  const handleChange = (key, val) => {
    setValues((v) => ({ ...v, [key]: val }))
    if (touched[key]) {
      // Revalidate on change if already touched
      const errs = validate({ ...values, [key]: val })
      setErrors((e) => ({ ...e, [key]: errs[key] }))
    }
  }

  const handleBlur = (key) => {
    setTouched((t) => ({ ...t, [key]: true }))
    const errs = validate(values)
    setErrors((e) => ({ ...e, [key]: errs[key] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const allTouched = Object.fromEntries(FIELDS.map((f) => [f.key, true]))
    setTouched(allTouched)
    const errs = validate(values)
    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      toast.error('Please fix the errors before predicting.')
      return
    }

    const payload = {
      temperature: parseFloat(values.temperature),
      humidity:    parseFloat(values.humidity),
      wind_speed:  parseFloat(values.wind_speed),
    }

    const data = await predict(payload)
    if (data) {
      onResult?.({ inputs: payload, result: data })
      toast.success('Prediction ready!')
    } else if (error) {
      toast.error(error)
    }
  }

  const handleReset = () => {
    setValues({ temperature: '', humidity: '', wind_speed: '' })
    setTouched({})
    setErrors({})
    reset()
  }

  return (
    <section id="predict" className="py-20" aria-label="Prediction tool">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Section heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
              Run a Prediction
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base max-w-md mx-auto">
              Enter today's weather data and the ML model will predict tomorrow's rainfall.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <div className="card p-8">
              <form onSubmit={handleSubmit} noValidate id="prediction-form">
                <div className="flex flex-col gap-5">
                  {FIELDS.map(({ id, key, label, icon: Icon, placeholder, unit, hint }) => (
                    <div key={key}>
                      <label
                        htmlFor={id}
                        className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                      >
                        {label}
                      </label>
                      <div className="relative">
                        <Icon
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          aria-hidden="true"
                        />
                        <input
                          id={id}
                          type="number"
                          step="any"
                          inputMode="decimal"
                          placeholder={placeholder}
                          value={values[key]}
                          onChange={(e) => handleChange(key, e.target.value)}
                          onBlur={() => handleBlur(key)}
                          aria-describedby={`${id}-hint ${errors[key] ? `${id}-error` : ''}`}
                          aria-invalid={!!errors[key]}
                          className={`input-base pl-9 pr-14 ${errors[key] && touched[key] ? 'input-error' : ''}`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400 pointer-events-none">
                          {unit}
                        </span>
                      </div>
                      <AnimatePresence mode="wait">
                        {errors[key] && touched[key] ? (
                          <motion.p
                            key="error"
                            id={`${id}-error`}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-1.5 text-xs text-red-500 font-medium"
                            role="alert"
                          >
                            {errors[key]}
                          </motion.p>
                        ) : (
                          <p key="hint" id={`${id}-hint`} className="mt-1.5 text-xs text-slate-400">
                            {hint}
                          </p>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-8">
                  <button
                    type="submit"
                    id="predict-submit-btn"
                    disabled={loading}
                    className="btn btn-primary flex-1"
                    aria-busy={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner" aria-hidden="true" />
                        Predicting…
                      </>
                    ) : (
                      <>
                        Predict Rain
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                  {(result || Object.values(values).some(Boolean)) && (
                    <button
                      type="button"
                      id="predict-reset-btn"
                      onClick={handleReset}
                      className="btn btn-outline w-12 p-0"
                      aria-label="Reset form"
                    >
                      <RotateCcw size={16} />
                    </button>
                  )}
                </div>

                {/* API error banner */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900 text-sm text-red-600 dark:text-red-400"
                      role="alert"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Result card */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 24 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-6"
                >
                  <ResultCard result={result} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
