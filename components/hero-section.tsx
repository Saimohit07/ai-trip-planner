import { Plane, Map, Compass, Globe } from "lucide-react"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 opacity-10">
          <Plane className="h-32 w-32 text-primary rotate-45" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-10">
          <Globe className="h-40 w-40 text-accent" />
        </div>
        <div className="absolute top-1/2 right-1/4 opacity-5">
          <Compass className="h-24 w-24 text-foreground" />
        </div>
      </div>

      <div className="text-center space-y-6 py-12 md:py-20">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm text-primary">
          <Map className="h-4 w-4" />
          <span>AI-Powered Travel Planning</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight text-balance">
          Plan Your Perfect Trip
          <br />
          <span className="text-primary">With AI</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
          Get personalized day-by-day itineraries, cost breakdowns, and local tips 
          for any destination in seconds.
        </p>

        <div className="flex flex-wrap justify-center gap-6 pt-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Plane className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm">Any Destination</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
              <Compass className="h-4 w-4 text-accent" />
            </div>
            <span className="text-sm">Smart Recommendations</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Globe className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm">Instant Results</span>
          </div>
        </div>
      </div>
    </div>
  )
}
