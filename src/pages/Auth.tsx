import { useState, useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useAuth } from '../hooks/use-auth'
import { Navigate, useSearchParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'

export default function AuthPage() {
  const { user, loading, error } = useAuth()
  const [searchParams] = useSearchParams()
  const [currentOrigin, setCurrentOrigin] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [authSuccess, setAuthSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('signin')
  const [logoError, setLogoError] = useState(false)

  const logoSources = [
    "https://i.imgur.com/djUszhJ.png", // Direct Imgur image URL
    "https://rbhvcwzjvgatesivsxbb.supabase.co/storage/v1/object/public/instantleadmagnet/InstantLeadMagnet.png",
    "/logo.png"
  ]
  
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0)

  const handleLogoError = () => {
    if (currentLogoIndex < logoSources.length - 1) {
      setCurrentLogoIndex(currentLogoIndex + 1)
    } else {
      setLogoError(true)
    }
  }

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
          setAuthSuccess('✅ Account created successfully! You are now signed in.')
          setAuthError(null)
        } else if (event === 'SIGNED_IN') {
          console.log('User signed in successfully!')
          setAuthSuccess('✅ Signed in successfully!')
          setAuthError(null)
        } else if (event === 'USER_UPDATED') {
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
              <p className="text-xs text-red-600 mt-2">Please check your environment variables in the .env file.</p>
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
          {/* Logo */}
          <div className="mb-4">
            {!logoError ? (
              <img 
                key={currentLogoIndex}
                src={logoSources[currentLogoIndex]}
                alt="Lead Magnet AI"
                className="mx-auto h-16 w-auto object-contain"
                onError={handleLogoError}
              />
            ) : (
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                LM
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">Welcome to Lead Magnet AI</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one to start generating lead magnets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Success Message */}
          {authSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
              {authSuccess}
            </div>
          )}

          {/* Error Message */}
          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              {authError}
            </div>
          )}

          {/* Auth Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
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
                  showLinks={false}
                  view="sign_in"
                  localization={{
                    variables: {
                      sign_in: {
                        email_label: 'Email address',
                        password_label: 'Password',
                        button_label: 'Sign In',
                        loading_button_label: 'Signing in...',
                      }
                    }
                  }}
                />
              )}
              <div className="text-center">
                <Button 
                  variant="link" 
                  onClick={() => setActiveTab('signup')}
                  className="text-sm"
                >
                  Don't have an account? Sign up
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
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
                  showLinks={false}
                  view="sign_up"
                  localization={{
                    variables: {
                      sign_up: {
                        email_label: 'Email address',
                        password_label: 'Create a password (min 6 characters)',
                        button_label: 'Create Account',
                        loading_button_label: 'Creating account...',
                      }
                    }
                  }}
                />
              )}
              <div className="text-center">
                <Button 
                  variant="link" 
                  onClick={() => setActiveTab('signin')}
                  className="text-sm"
                >
                  Already have an account? Sign in
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-4 text-center text-xs text-muted-foreground">
            <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
