import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'

export function SupabaseConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const testConnection = async () => {
    setConnectionStatus('testing')
    setErrorMessage('')

    try {
      // Test basic connection
      const { data, error } = await supabase!.from('users').select('count').limit(1)
      
      if (error) {
        throw error
      }

      setConnectionStatus('success')
    } catch (error: any) {
      console.error('Supabase connection test failed:', error)
      setConnectionStatus('error')
      setErrorMessage(error.message || 'Unknown connection error')
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  if (connectionStatus === 'testing') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Testing Supabase Connection</CardTitle>
          <CardDescription>Please wait while we test the connection...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (connectionStatus === 'success') {
    return (
      <Card className="w-full max-w-md border-green-200">
        <CardHeader>
          <CardTitle className="text-green-600">✅ Connection Successful</CardTitle>
          <CardDescription>Supabase is connected and working properly</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md border-red-200">
      <CardHeader>
        <CardTitle className="text-red-600">❌ Connection Failed</CardTitle>
        <CardDescription>Unable to connect to Supabase</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700 font-mono">{errorMessage}</p>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium">Possible Solutions:</h3>
          <ul className="text-sm space-y-2 list-disc list-inside text-gray-600">
            <li>Check if your Supabase project is paused (common with free tier)</li>
            <li>Verify the project URL is correct</li>
            <li>Ensure your project exists and is active</li>
            <li>Check your internet connection</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Current Configuration:</h3>
          <div className="text-xs font-mono bg-gray-100 p-2 rounded">
            <p>URL: {import.meta.env.VITE_SUPABASE_URL}</p>
            <p>Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '***configured***' : 'NOT SET'}</p>
          </div>
        </div>

        <Button onClick={testConnection} className="w-full">
          Retry Connection
        </Button>
      </CardContent>
    </Card>
  )
}
