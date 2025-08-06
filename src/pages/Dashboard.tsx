import { useAuth } from '../hooks/use-auth'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { PlusCircle, FileText, BarChart3, Settings, Sparkles } from 'lucide-react'
import { SupabaseSetup } from '../components/SupabaseSetup'
import { isSupabaseConfigured } from '../lib/supabase'

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const [logoError, setLogoError] = useState(false)
  const [stats, setStats] = useState({
    totalLeadMagnets: 0,
    totalDownloads: 0,
    conversionRate: 0
  })

  const logoSources = [
    "https://i.imgur.com/Y9Sz4XE.png", // Direct Imgur image URL
    "https://i.imgur.com/Y9Sz4XE.jpg", // Try JPG format
    "https://i.imgur.com/Y9Sz4XE.jpeg", // Try JPEG format
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
    if (!loading && !user && isSupabaseConfigured) {
      navigate('/auth')
    }
  }, [user, loading, navigate])

  // Show Supabase setup if not configured
  if (!isSupabaseConfigured) {
    return <SupabaseSetup />
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

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              {!logoError ? (
                <img 
                  key={currentLogoIndex}
                  src={logoSources[currentLogoIndex]}
                  alt="Lead Magnet AI"
                  className="h-32 w-auto object-contain"
                  onError={handleLogoError}
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="h-32 w-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  LM
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {user.email}
              </Badge>
              <Button onClick={signOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-3 sm:px-6 lg:px-8">
        <div className="px-4 py-3 sm:px-0">
          {/* Welcome Section - Moved Up */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back! 👋
            </h2>
            <p className="text-gray-600">
              Ready to create some high-converting lead magnets with AI?
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Lead Magnets</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalLeadMagnets}</div>
                <p className="text-xs text-muted-foreground">
                  +0 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDownloads}</div>
                <p className="text-xs text-muted-foreground">
                  +0 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.conversionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  +0% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/create')}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <PlusCircle className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Create Lead Magnet</CardTitle>
                </div>
                <CardDescription>
                  Generate a new lead magnet with AI assistance. Choose from templates or create from scratch.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Creating
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/library')}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">My Lead Magnets</CardTitle>
                </div>
                <CardDescription>
                  View, edit, and manage all your existing lead magnets in one place.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Library
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/analytics')}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg">Analytics</CardTitle>
                </div>
                <CardDescription>
                  Track performance, downloads, and conversion rates for your lead magnets.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Getting Started */}
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>Getting Started</span>
              </CardTitle>
              <CardDescription>
                New to Lead Magnet AI? Here's how to create your first high-converting lead magnet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Choose Your Lead Magnet Type</p>
                    <p className="text-sm text-muted-foreground">Select from eBooks, checklists, templates, guides, and more.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Provide Your Topic & Audience</p>
                    <p className="text-sm text-muted-foreground">Tell our AI about your niche and target audience.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <p className="font-medium">AI Generates Your Content</p>
                    <p className="text-sm text-muted-foreground">Our AI creates compelling, valuable content tailored to your audience.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Customize & Download</p>
                    <p className="text-sm text-muted-foreground">Edit, style, and export your lead magnet as PDF or other formats.</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button onClick={() => navigate('/create')} className="w-full sm:w-auto">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Your First Lead Magnet
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
