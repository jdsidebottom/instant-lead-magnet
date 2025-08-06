import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Home() {
  const [logoError, setLogoError] = useState(false)
  
  // Try multiple logo sources - using correct Imgur direct image URL
  const logoSources = [
    "https://i.imgur.com/Y9Sz4XE.png", // Direct Imgur image URL
    "https://i.imgur.com/Y9Sz4XE.jpg", // Try JPG format too
    "https://i.imgur.com/Y9Sz4XE.jpeg", // Try JPEG format
    "https://rbhvcwzjvgatesivsxbb.supabase.co/storage/v1/object/public/instantleadmagnet/InstantLeadMagnet.png",
    "/logo.png", // Local fallback
    "https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Lead+Magnet+AI" // Ultimate fallback
  ]
  
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0)

  const handleLogoError = () => {
    console.log(`Logo failed to load: ${logoSources[currentLogoIndex]}`)
    if (currentLogoIndex < logoSources.length - 1) {
      setCurrentLogoIndex(currentLogoIndex + 1)
    } else {
      setLogoError(true)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="z-10 max-w-6xl w-full items-center justify-center text-center">
        {/* Extra Large Logo - No Title */}
        <div className="-mb-4">
          {!logoError ? (
            <img 
              key={currentLogoIndex} // Force re-render when source changes
              src={logoSources[currentLogoIndex]}
              alt="Instant Lead Magnet AI"
              className="mx-auto h-[32rem] w-auto object-contain max-w-full"
              onError={handleLogoError}
              onLoad={() => console.log(`Logo loaded successfully: ${logoSources[currentLogoIndex]}`)}
              crossOrigin="anonymous"
            />
          ) : (
            <div className="mx-auto h-[32rem] w-[48rem] max-w-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-6xl shadow-lg">
              Lead Magnet AI
            </div>
          )}
        </div>
        
        <p className="text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          Generate high-converting lead magnets with the power of AI. Create ebooks, checklists, templates, and guides in minutes.
        </p>
        
        <div className="flex gap-6 justify-center">
          <Link 
            to="/auth" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 py-3"
          >
            Get Started
          </Link>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-8 py-3"
          >
            Dashboard
          </Link>
        </div>
        
        {/* Debug info - smaller and less prominent */}
        <div className="mt-12 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 max-w-xl mx-auto">
          <p><strong>Debug Info:</strong></p>
          <p>Logo attempt: {currentLogoIndex + 1} of {logoSources.length} | Status: {logoError ? 'Using fallback' : 'Loaded'}</p>
          <p className="truncate">Current URL: {logoSources[currentLogoIndex]}</p>
        </div>
      </div>
    </main>
  )
}
