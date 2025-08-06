import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

// Get environment variables with validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase Config:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey
})

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

// Validate URL format
const isValidSupabaseUrl = (url: string) => {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.includes('supabase.co') || urlObj.hostname.includes('localhost')
  } catch {
    return false
  }
}

// Create supabase client
export const supabase = supabaseUrl && supabaseAnonKey && isValidSupabaseUrl(supabaseUrl)
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    })
  : null

// Export configuration status
export const isSupabaseConfigured = !!supabase

// Test connection function
export const testSupabaseConnection = async () => {
  if (!supabase) {
    throw new Error('Supabase client not configured')
  }

  try {
    // Simple health check
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Supabase connection test failed:', error)
    throw error
  }
}

// Simple auth helpers
export const signOut = async () => {
  if (!supabase) {
    return { error: new Error('Supabase not configured') }
  }

  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  if (!supabase) {
    return { user: null, error: new Error('Supabase not configured') }
  }

  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const getSession = async () => {
  if (!supabase) {
    return { session: null, error: new Error('Supabase not configured') }
  }

  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}
