import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { TripForm } from "@/components/trip-form"
import { FeaturesSection } from "@/components/features-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <HeroSection />
        
        {/* Trip Planning Form */}
        <section className="max-w-2xl mx-auto -mt-4">
          <Card className="bg-card border-border shadow-2xl shadow-primary/5">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl text-foreground">
                Start Planning Your Adventure
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Tell us about your dream trip and let AI do the rest
              </p>
            </CardHeader>
            <CardContent>
              <TripForm />
            </CardContent>
          </Card>
        </section>

        <FeaturesSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>Wanderlust AI - Your AI-Powered Travel Companion</p>
        </div>
      </footer>
    </div>
  )
}
