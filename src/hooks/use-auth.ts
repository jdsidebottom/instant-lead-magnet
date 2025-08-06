import { useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, signOut as supabaseSignOut, isSupabaseConfigured } from '../lib/supabase'
import type { Database } from '../types/database'

type UserProfile = Database['public']['Tables']['users']['Row']

export function useAuth() {
  // Always call hooks in the same order - never conditionally
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check configuration inside useEffect, not before hooks
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      setError('Supabase not configured')
      return
    }

    let mounted = true // Prevent state updates if component unmounts

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return // Component unmounted
        
        if (error) {
          console.error('Error getting session:', error)
          setError(error.message)
        } else {
          console.log('Initial session:', session?.user?.email || 'No session')
          setSession(session)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            await fetchUserProfile(session.user.id)
          }
        }
      } catch (error) {
        if (!mounted) return
        console.error('Error in getInitialSession:', error)
        setError(error instanceof Error ? error.message : 'Unknown error')
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    const fetchUserProfile = async (userId: string) => {
      try {
        console.log('Fetching user profile for:', userId)
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()

        if (!mounted) return

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error fetching user profile:', error)
        } else if (data) {
          console.log('User profile loaded:', data.email)
          setProfile(data)
        } else {
          console.log('No user profile found, will be created by trigger')
        }
      } catch (error) {
        if (mounted) {
          console.error('Error fetching user profile:', error)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      
      console.log('Auth state changed:', event, session?.user?.email || 'No user')
      
      setSession(session)
      setUser(session?.user ?? null)
      setError(null)
      
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, []) // Empty dependency array

  const signOut = async () => {
    const { error } = await supabaseSignOut()
    if (error) {
      console.error('Error signing out:', error)
    }
    return { error }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !supabase) return { error: new Error('No user logged in or Supabase not configured') }

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating profile:', error)
        return { error }
      }

      setProfile(data)
      return { data, error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { error }
    }
  }

  return {
    user,
    profile,
    session,
    loading,
    error,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
    isConfigured: isSupabaseConfigured,
  }
}
