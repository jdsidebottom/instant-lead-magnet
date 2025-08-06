import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { AlertCircle, CheckCircle, Copy } from 'lucide-react'

export function SupabaseSetup() {
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseKey, setSupabaseKey] = useState('')
  const [showInstructions, setShowInstructions] = useState(true)

  const handleSave = () => {
    // This would typically save to .env file
    // For now, just show the user what to do
    alert(`Please update your .env file with:
VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseKey}

Then restart your development server.`)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-6 w-6 text-orange-500" />
            <CardTitle className="text-xl">Supabase Configuration Required</CardTitle>
          </div>
          <CardDescription>
            Your Supabase credentials are not configured. Follow these steps to set up your database connection.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {showInstructions && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3">📋 Setup Instructions</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">supabase.com</a> and sign in</li>
                <li>Create a new project or select your existing project</li>
                <li>Go to <strong>Settings → API</strong> in your Supabase dashboard</li>
                <li>Copy your <strong>Project URL</strong> and <strong>anon public key</strong></li>
                <li>Paste them in the form below</li>
              </ol>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="supabase-url">Supabase Project URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="supabase-url"
                  placeholder="https://your-project.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(supabaseUrl)}
                  disabled={!supabaseUrl}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supabase-key">Supabase Anon Key</Label>
              <div className="flex space-x-2">
                <Input
                  id="supabase-key"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  type="password"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(supabaseKey)}
                  disabled={!supabaseKey}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {supabaseUrl && supabaseKey && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-900">Ready to Configure!</h4>
              </div>
              <p className="text-sm text-green-800 mb-3">
                Copy this configuration to your <code className="bg-green-100 px-1 rounded">.env</code> file:
              </p>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto">
                <div>VITE_SUPABASE_URL={supabaseUrl}</div>
                <div>VITE_SUPABASE_ANON_KEY={supabaseKey}</div>
              </div>
              <Button
                onClick={() => copyToClipboard(`VITE_SUPABASE_URL=${supabaseUrl}\nVITE_SUPABASE_ANON_KEY=${supabaseKey}`)}
                className="mt-3 w-full"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Configuration
              </Button>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Important Notes</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
              <li>After updating the .env file, restart your development server</li>
              <li>Make sure your Supabase project is not paused (common with free tier)</li>
              <li>The database schema will be created automatically when you connect</li>
            </ul>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowInstructions(!showInstructions)}
              className="flex-1"
            >
              {showInstructions ? 'Hide' : 'Show'} Instructions
            </Button>
            <Button
              onClick={() => window.location.reload()}
              disabled={!supabaseUrl || !supabaseKey}
              className="flex-1"
            >
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
