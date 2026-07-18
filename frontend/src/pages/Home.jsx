/**
 * Home page — composes all sections
 */
import HeroSection     from '@/components/HeroSection'
import PredictionCard  from '@/components/PredictionCard'
import HistoryPanel    from '@/components/HistoryPanel'
import Footer          from '@/components/Footer'
import { useHistory }  from '@/hooks/useHistory'

export default function Home() {
  const { history, addEntry, clearHistory } = useHistory()

  const handleResult = ({ inputs, result }) => {
    addEntry(inputs, result)
  }

  return (
    <main>
      <HeroSection />
      <PredictionCard onResult={handleResult} />
      <HistoryPanel history={history} clearHistory={clearHistory} />
      <Footer />
    </main>
  )
}
