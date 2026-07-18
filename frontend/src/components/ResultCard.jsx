/**
 * ResultCard — displays the ML prediction result with animations
 */
import { motion } from 'framer-motion'
import { CloudRain, Sun, Droplets, BarChart2, Cpu } from 'lucide-react'

function ConfidenceBar({ confidence }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          Confidence
        </span>
        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
          {confidence}%
        </span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full rounded-full ${
            confidence >= 70
              ? 'bg-emerald-500'
              : confidence >= 50
              ? 'bg-blue-500'
              : 'bg-amber-500'
          }`}
        />
      </div>
    </div>
  )
}

export default function ResultCard({ result }) {
  if (!result) return null

  const willRain = result.will_rain
  const isHeavy  = (result.confidence || 0) >= 78

  const accentClass = willRain
    ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-900'
    : 'bg-amber-50  dark:bg-amber-950  border-amber-200  dark:border-amber-900'

  const iconClass = willRain
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-amber-600 dark:text-amber-400'

  const labelClass = willRain
    ? 'text-emerald-700 dark:text-emerald-300'
    : 'text-amber-700 dark:text-amber-300'

  return (
    <div className="card p-6" role="region" aria-label="Prediction result">
      {/* Header badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border mb-5 ${accentClass} ${labelClass}`}>
        {willRain ? <CloudRain size={14} /> : <Sun size={14} />}
        {result.condition}
      </div>

      {/* Main verdict */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide mb-1">
            Rain Tomorrow
          </p>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className={`text-5xl font-extrabold tracking-tight ${labelClass}`}
          >
            {result.rain}
          </motion.div>
        </div>

        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.1 }}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center ${accentClass} ${iconClass}`}
          aria-hidden="true"
        >
          {willRain ? <CloudRain size={32} /> : <Sun size={32} />}
        </motion.div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Droplets size={14} className="text-blue-500" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Rainfall
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {result.rainfall}
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 size={14} className="text-purple-500" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Confidence
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {result.confidence}%
          </p>
        </div>
      </div>

      {/* Confidence bar */}
      <ConfidenceBar confidence={result.confidence} />

      {/* Model source */}
      <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
        <Cpu size={12} />
        {result.model_source === 'trained-ml-model'
          ? 'HistGradientBoosting · Trained on weatherAUS dataset'
          : 'Heuristic fallback · Model file not found'}
      </div>
    </div>
  )
}
