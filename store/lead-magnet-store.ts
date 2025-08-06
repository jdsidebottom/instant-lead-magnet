import { create } from 'zustand'

interface LeadMagnet {
  id: string
  title: string
  description: string
  content: string
  type: 'ebook' | 'checklist' | 'template' | 'guide'
  createdAt: Date
}

interface LeadMagnetState {
  leadMagnets: LeadMagnet[]
  currentLeadMagnet: LeadMagnet | null
  isGenerating: boolean
  addLeadMagnet: (leadMagnet: LeadMagnet) => void
  setCurrentLeadMagnet: (leadMagnet: LeadMagnet | null) => void
  setIsGenerating: (isGenerating: boolean) => void
  removeLeadMagnet: (id: string) => void
}

export const useLeadMagnetStore = create<LeadMagnetState>((set) => ({
  leadMagnets: [],
  currentLeadMagnet: null,
  isGenerating: false,
  addLeadMagnet: (leadMagnet) =>
    set((state) => ({
      leadMagnets: [...state.leadMagnets, leadMagnet],
    })),
  setCurrentLeadMagnet: (leadMagnet) =>
    set({ currentLeadMagnet: leadMagnet }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  removeLeadMagnet: (id) =>
    set((state) => ({
      leadMagnets: state.leadMagnets.filter((lm) => lm.id !== id),
    })),
}))
