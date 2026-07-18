/**
 * HistoryPanel — prediction history stored in localStorage
 */
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, CloudRain, Sun, Trash2, ChevronRight } from 'lucide-react'

function formatTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month:  'short',
    day:    'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  })
}

function HistoryItem({ entry, index }) {
  const { inputs, result, timestamp } = entry
  const willRain = result.will_rain

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16, height: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors group"
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
        willRain
          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
          : 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
      }`}>
        {willRain ? <CloudRain size={18} /> : <Sun size={18} />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-sm font-bold ${willRain ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
            Rain: {result.rain}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">{result.rainfall}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">{result.confidence}% confidence</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
          <span>{inputs.temperature}°C</span>
          <span>{inputs.humidity}% humidity</span>
          <span>{inputs.wind_speed} km/h</span>
        </div>
      </div>

      {/* Timestamp */}
      <div className="flex-shrink-0 text-right">
        <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <Clock size={10} />
          {formatTime(timestamp)}
        </div>
      </div>
    </motion.div>
  )
}

export default function HistoryPanel({ history, clearHistory }) {
  return (
    <section id="history" className="py-20 bg-slate-50 dark:bg-slate-900/50" aria-label="Prediction history">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                Recent Predictions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Stored locally in your browser
              </p>
            </div>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                id="clear-history-btn"
                className="btn btn-ghost text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                aria-label="Clear prediction history"
              >
                <Trash2 size={14} />
                Clear
              </button>
            )}
          </div>

          {/* List */}
          {history.length === 0 ? (
            <div className="text-center py-16 text-slate-400 dark:text-slate-500">
              <Clock size={40} className="mx-auto mb-3 opacity-40" aria-hidden="true" />
              <p className="text-sm">No predictions yet. Run one above!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-w-2xl mx-auto">
              <AnimatePresence initial={false}>
                {history.map((entry, i) => (
                  <HistoryItem key={entry.id} entry={entry} index={i} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
