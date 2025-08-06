import { useState } from 'react'
import { useAuth } from '../hooks/use-auth'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { ArrowLeft, Sparkles, FileText, CheckSquare, BookOpen, Layout, Target, Zap } from 'lucide-react'

const leadMagnetTypes = [
  {
    id: 'ebook',
    name: 'eBook',
    description: 'Comprehensive guide or educational content',
    icon: BookOpen,
    color: 'text-blue-600'
  },
  {
    id: 'checklist',
    name: 'Checklist',
    description: 'Step-by-step actionable checklist',
    icon: CheckSquare,
    color: 'text-green-600'
  },
  {
    id: 'template',
    name: 'Template',
    description: 'Ready-to-use template or worksheet',
    icon: Layout,
    color: 'text-purple-600'
  },
  {
    id: 'guide',
    name: 'Quick Guide',
    description: 'Concise how-to guide or tutorial',
    icon: FileText,
    color: 'text-orange-600'
  },
  {
    id: 'cheatsheet',
    name: 'Cheat Sheet',
    description: 'Quick reference or summary sheet',
    icon: Zap,
    color: 'text-red-600'
  }
]

export default function CreateLeadMagnet() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    topic: '',
    audience: '',
    description: '',
    tone: 'professional',
    length: 'medium'
  })
  const [isGenerating, setIsGenerating] = useState(false)

  if (!user) {
    navigate('/auth')
    return null
  }

  const handleTypeSelect = (type: string) => {
    setFormData({ ...formData, type })
    setStep(2)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false)
      navigate('/preview', { state: { leadMagnetData: formData } })
    }, 3000)
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Lead Magnet Type</h2>
        <p className="text-gray-600">Select the type of lead magnet you want to create</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leadMagnetTypes.map((type) => {
          const IconComponent = type.icon
          return (
            <Card 
              key={type.id}
              className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary"
              onClick={() => handleTypeSelect(type.id)}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <IconComponent className={`h-8 w-8 ${type.color}`} />
                </div>
                <CardTitle className="text-lg">{type.name}</CardTitle>
                <CardDescription>{type.description}</CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell Us About Your Lead Magnet</h2>
        <p className="text-gray-600">Provide details so our AI can create the perfect content for you</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Lead Magnet Title</Label>
          <Input
            id="title"
            placeholder="e.g., The Ultimate Guide to Social Media Marketing"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="topic">Topic/Niche</Label>
          <Input
            id="topic"
            placeholder="e.g., Digital Marketing, Personal Finance, Fitness"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="audience">Target Audience</Label>
          <Input
            id="audience"
            placeholder="e.g., Small business owners, Fitness beginners, New parents"
            value={formData.audience}
            onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Describe what specific problems this lead magnet should solve or what value it should provide..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tone">Tone of Voice</Label>
            <Select value={formData.tone} onValueChange={(value) => setFormData({ ...formData, tone: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly & Conversational</SelectItem>
                <SelectItem value="authoritative">Authoritative</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="length">Content Length</Label>
            <Select value={formData.length} onValueChange={(value) => setFormData({ ...formData, length: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short (1-2 pages)</SelectItem>
                <SelectItem value="medium">Medium (3-5 pages)</SelectItem>
                <SelectItem value="long">Long (6+ pages)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button 
            onClick={handleGenerate} 
            disabled={!formData.title || !formData.topic || !formData.audience || isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Lead Magnet
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-gray-900">Create Lead Magnet</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500">Step {step} of 2</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
        </div>
      </main>
    </div>
  )
}
