import { z } from 'zod'

export const leadMagnetSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  targetAudience: z.string().min(1, 'Target audience is required'),
  industry: z.string().min(1, 'Industry is required'),
  type: z.enum(['ebook', 'checklist', 'template', 'guide'], {
    required_error: 'Please select a lead magnet type',
  }),
  tone: z.enum(['professional', 'casual', 'friendly', 'authoritative'], {
    required_error: 'Please select a tone',
  }),
})

export type LeadMagnetFormData = z.infer<typeof leadMagnetSchema>
