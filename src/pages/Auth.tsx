import { useState, useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { useAuth } from '../hooks/use-auth'
import { Navigate, useSearchParams } from 'react-router-dom'

export default function AuthPage() {
  const { user, loading, error } = useAuth()
  const [searchParams] = useSearchParams()
  const [currentOrigin, setCurrentOrigin] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    setCurrentOrigin(window.location.origin)
    
    // Check for error from URL params
    const urlError = searchParams.get('error')
    if (urlError) {
      setAuthError(decodeURIComponent(urlError))
    }
    
    // Listen for auth events
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth event:', event, session?.user?.email || 'No user')
        
        if (event === 'SIGNED_UP') {
          setAuthError('✅ Account created and signed in successfully!')
        } else if (event === 'SIGNED_IN') {
          console.log('User signed in successfully!')
          setAuthError(null)
        }
      })

      return () => subscription.unsubscribe()
    }
  }, [searchParams])

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Supabase Configuration Error</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">Supabase client could not be initialized.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Lead Magnet AI</CardTitle>
          <CardDescription>
            Create your account to start generating high-converting lead magnets with AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Success Message */}
          {authError && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
              {authError}
            </div>
          )}

          {/* Auth Component */}
          {supabase && currentOrigin && (
            <Auth
              supabaseClient={supabase}
              appearance={{ 
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'hsl(221.2 83.2% 53.3%)',
                      brandAccent: 'hsl(221.2 83.2% 53.3%)',
                    }
                  }
                }
              }}
              providers={[]}
              redirectTo={`${currentOrigin}/dashboard`}
              showLinks={true}
              view="sign_up"
              localization={{
                variables: {
                  sign_up: {
                    email_label: 'Email address',
                    password_label: 'Create a password (min 6 characters)',
                    button_label: 'Create Account & Sign In',
                    loading_button_label: 'Creating account...',
                    link_text: 'Already have an account? Sign in'
                  },
                  sign_in: {
                    email_label: 'Email address',
                    password_label: 'Password',
                    button_label: 'Sign In',
                    loading_button_label: 'Signing in...',
                    link_text: "Don't have an account? Sign up"
                  }
                }
              }}
            />
          )}
          
          <div className="mt-4 text-center text-xs text-muted-foreground">
            <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
