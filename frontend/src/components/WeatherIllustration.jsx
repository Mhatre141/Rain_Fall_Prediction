/**
 * WeatherIllustration — animated SVG weather scene
 */
import { motion } from 'framer-motion'

export default function WeatherIllustration() {
  return (
    <svg
      viewBox="0 0 420 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Weather illustration"
      className="w-full max-w-md mx-auto"
    >
      {/* Sky background */}
      <rect width="420" height="320" rx="20" fill="currentColor" className="text-blue-50 dark:text-slate-800" />

      {/* Sun */}
      <motion.circle
        cx="340" cy="70" r="38"
        fill="#FCD34D"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <motion.line
          key={angle}
          x1={340 + Math.cos((angle * Math.PI) / 180) * 46}
          y1={70 + Math.sin((angle * Math.PI) / 180) * 46}
          x2={340 + Math.cos((angle * Math.PI) / 180) * 58}
          y2={70 + Math.sin((angle * Math.PI) / 180) * 58}
          stroke="#FCD34D"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}

      {/* Main cloud */}
      <motion.g
        animate={{ x: [0, 6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse cx="170" cy="130" rx="80" ry="50" fill="white" className="drop-shadow-sm" />
        <ellipse cx="120" cy="148" rx="55" ry="38" fill="white" />
        <ellipse cx="220" cy="150" rx="52" ry="35" fill="white" />
        <ellipse cx="170" cy="160" rx="80" ry="30" fill="white" />
      </motion.g>

      {/* Secondary cloud */}
      <motion.g
        animate={{ x: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <ellipse cx="310" cy="155" rx="55" ry="33" fill="#e2e8f0" className="dark:fill-slate-600" />
        <ellipse cx="270" cy="168" rx="38" ry="26" fill="#e2e8f0" className="dark:fill-slate-600" />
        <ellipse cx="348" cy="170" rx="38" ry="24" fill="#e2e8f0" className="dark:fill-slate-600" />
      </motion.g>

      {/* Rain drops from main cloud */}
      {[140, 158, 176, 125, 195].map((x, i) => (
        <motion.g key={x}>
          <motion.rect
            x={x} y={190} width="3" height="14" rx="1.5"
            fill="#3b82f6"
            animate={{ y: [190, 240], opacity: [1, 0] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.22,
              ease: 'easeIn',
            }}
          />
        </motion.g>
      ))}

      {/* Ground */}
      <rect x="0" y="252" width="420" height="68" rx="0" fill="#22c55e" opacity="0.15" />
      <rect x="0" y="270" width="420" height="50" rx="0" fill="#16a34a" opacity="0.12" />

      {/* Puddle */}
      <motion.ellipse
        cx="170" cy="278" rx="52" ry="10"
        fill="#93c5fd" opacity="0.5"
        animate={{ rx: [52, 60, 52] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Ripples on puddle */}
      {[0, 0.8, 1.6].map((delay, i) => (
        <motion.ellipse
          key={i}
          cx="170" cy="278" rx="10" ry="3"
          stroke="#60a5fa" strokeWidth="1.5" fill="none"
          animate={{ rx: [10, 50], ry: [3, 9], opacity: [0.8, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay, ease: 'easeOut' }}
        />
      ))}

      {/* Stats bubble */}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <rect x="18" y="60" width="130" height="52" rx="12" fill="white" className="drop-shadow" />
        <rect x="18" y="60" width="130" height="52" rx="12" stroke="#e2e8f0" strokeWidth="1" />
        <text x="83" y="83" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="Inter, sans-serif">Confidence</text>
        <text x="83" y="101" textAnchor="middle" fontSize="18" fontWeight="700" fill="#2563eb" fontFamily="Inter, sans-serif">84.2%</text>
      </motion.g>

      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <rect x="270" y="205" width="130" height="52" rx="12" fill="white" className="drop-shadow" />
        <rect x="270" y="205" width="130" height="52" rx="12" stroke="#e2e8f0" strokeWidth="1" />
        <text x="335" y="228" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="Inter, sans-serif">Expected Rain</text>
        <text x="335" y="246" textAnchor="middle" fontSize="18" fontWeight="700" fill="#059669" fontFamily="Inter, sans-serif">12.4 mm</text>
      </motion.g>
    </svg>
  )
}
