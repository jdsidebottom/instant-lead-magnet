import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './use-auth'
import type { Database } from '../types/database'

type LeadMagnet = Database['public']['Tables']['lead_magnets']['Row']
type LeadMagnetInsert = Database['public']['Tables']['lead_magnets']['Insert']
type LeadMagnetUpdate = Database['public']['Tables']['lead_magnets']['Update']

export function useLeadMagnets() {
  const { user } = useAuth()
  const [leadMagnets, setLeadMagnets] = useState<LeadMagnet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchLeadMagnets()
    } else {
      setLeadMagnets([])
      setLoading(false)
    }
  }, [user])

  const fetchLeadMagnets = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('lead_magnets')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setLeadMagnets(data || [])
    } catch (err) {
      console.error('Error fetching lead magnets:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createLeadMagnet = async (leadMagnet: Omit<LeadMagnetInsert, 'user_id'>) => {
    if (!user) {
      throw new Error('User must be authenticated')
    }

    try {
      const { data, error } = await supabase
        .from('lead_magnets')
        .insert({
          ...leadMagnet,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      setLeadMagnets(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      console.error('Error creating lead magnet:', err)
      const error = err instanceof Error ? err : new Error('An error occurred')
      return { data: null, error }
    }
  }

  const updateLeadMagnet = async (id: string, updates: LeadMagnetUpdate) => {
    try {
      const { data, error } = await supabase
        .from('lead_magnets')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      setLeadMagnets(prev =>
        prev.map(lm => (lm.id === id ? data : lm))
      )
      return { data, error: null }
    } catch (err) {
      console.error('Error updating lead magnet:', err)
      const error = err instanceof Error ? err : new Error('An error occurred')
      return { data: null, error }
    }
  }

  const deleteLeadMagnet = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lead_magnets')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setLeadMagnets(prev => prev.filter(lm => lm.id !== id))
      return { error: null }
    } catch (err) {
      console.error('Error deleting lead magnet:', err)
      const error = err instanceof Error ? err : new Error('An error occurred')
      return { error }
    }
  }

  return {
    leadMagnets,
    loading,
    error,
    createLeadMagnet,
    updateLeadMagnet,
    deleteLeadMagnet,
    refetch: fetchLeadMagnets,
  }
}
