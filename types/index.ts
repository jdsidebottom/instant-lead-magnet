export interface LeadMagnetForm {
  title: string
  description: string
  targetAudience: string
  industry: string
  type: 'ebook' | 'checklist' | 'template' | 'guide'
  tone: 'professional' | 'casual' | 'friendly' | 'authoritative'
}

export interface GeneratedContent {
  title: string
  content: string
  outline: string[]
  callToAction: string
}
