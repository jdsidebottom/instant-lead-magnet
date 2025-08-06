import { Routes, Route, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { supabase } from './lib/supabase'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import CreateLeadMagnet from './pages/CreateLeadMagnet'

function App() {
  const [searchParams] = useSearchParams()

  useEffect(() => {
    // Handle email confirmation codes
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    if (error) {
      console.error('Auth error:', error, errorDescription)
      window.location.href = '/auth?error=' + encodeURIComponent(errorDescription || error)
      return
    }

    if (code && supabase) {
      console.log('Processing email confirmation code:', code)
      
      supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
        if (error) {
          console.error('Error confirming email:', error)
          window.location.href = '/auth?error=' + encodeURIComponent(error.message)
        } else {
          console.log('Email confirmed successfully:', data.user?.email)
          window.history.replaceState({}, document.title, '/dashboard')
          window.location.href = '/dashboard'
        }
      })
    }
  }, [searchParams])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create" element={<CreateLeadMagnet />} />
    </Routes>
  )
}

export default App
