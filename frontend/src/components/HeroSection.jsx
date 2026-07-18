/**
 * HeroSection — landing hero with headline, subtext, stats, and illustration
 */
import { motion } from 'framer-motion'
import { ArrowDown, Zap, Database, TrendingUp } from 'lucide-react'
import WeatherIllustration from './WeatherIllustration'

const stats = [
  { icon: Database, label: 'Training Records', value: '145,460' },
  { icon: TrendingUp, label: 'Model Accuracy',  value: '85.3%'   },
  { icon: Zap,        label: 'Avg Response',    value: '< 200ms' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
}

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
}

export default function HeroSection() {
  return (
    <section
      id="about"
      className="pt-28 pb-20 md:pt-36 md:pb-28"
      aria-label="Hero section"
    >
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Copy */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="order-2 lg:order-1"
          >
            {/* Badge */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-full px-3 py-1 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                Machine Learning Powered
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-[2.75rem] sm:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-slate-50 mb-5"
            >
              Intelligent<br />
              <span className="text-blue-600 dark:text-blue-400">Weather</span> Prediction
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={fadeUp}
              className="text-lg text-slate-500 dark:text-slate-400 mb-9 leading-relaxed max-w-lg"
            >
              Predict tomorrow's rainfall using a machine learning model
              trained on <strong className="text-slate-700 dark:text-slate-300">145,000+</strong> real weather observations
              from across Australia.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-12">
              <a
                href="#predict"
                id="hero-cta-predict"
                className="btn btn-primary"
                aria-label="Go to prediction tool"
              >
                Try Prediction
                <ArrowDown size={16} />
              </a>
              <a
                href="#about"
                className="btn btn-outline"
                aria-label="Learn how it works"
              >
                How it works
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200 dark:border-slate-800"
            >
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center">
                  <div className="flex justify-center mb-2">
                    <Icon size={18} className="text-blue-500" />
                  </div>
                  <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2"
          >
            <WeatherIllustration />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
