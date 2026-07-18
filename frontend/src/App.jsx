/**
 * App.jsx — root component, applies dark mode class and renders pages
 */
import { Toaster } from 'react-hot-toast'
import { useDarkMode } from '@/hooks/useDarkMode'
import Navbar from '@/components/Navbar'
import Home   from '@/pages/Home'

export default function App() {
  const [isDark, setIsDark] = useDarkMode()

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Navbar isDark={isDark} setIsDark={setIsDark} />
      <Home />

      {/* Global toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '10px',
            background:   isDark ? '#1e293b' : '#ffffff',
            color:        isDark ? '#f1f5f9' : '#0f172a',
            border:       `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
            fontSize:     '14px',
            boxShadow:    '0 4px 24px rgba(0,0,0,0.1)',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
    </div>
  )
}
