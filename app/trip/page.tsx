"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { TripOverview } from "@/components/trip/trip-overview"
import { DayItinerary } from "@/components/trip/day-itinerary"
import { CostBreakdown } from "@/components/trip/cost-breakdown"
import { TravelTips } from "@/components/trip/travel-tips"
import { PackingList } from "@/components/trip/packing-list"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { buildApiUrl } from "@/lib/api"
import { ArrowLeft, Download, Share2 } from "lucide-react"

interface Activity {
  time: string
  activity: string
  description: string
  duration: string
  cost: string
  tips: string | null
}

interface Day {
  day: number
  title: string
  activities: Activity[]
}

interface TripPlan {
  destination: string
  overview: string
  bestTimeToVisit: string
  language: string
  currency: string
  itinerary: Day[]
  totalEstimatedCost: {
    accommodation: string
    food: string
    activities: string
    transportation: string
    total: string
  }
  travelTips: string[]
  packingList: string[]
}

export default function TripPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tripId = searchParams.get("id")
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let isMounted = true

    async function loadTrip() {
      setError("")

      if (tripId) {
        try {
          const response = await fetch(buildApiUrl(`/api/trips/${tripId}`))

          if (response.ok) {
            const data = await response.json()
            if (isMounted) {
              setTripPlan(data.trip)
              sessionStorage.setItem("tripPlan", JSON.stringify(data.trip))
              setIsLoading(false)
            }
            return
          }
        } catch (fetchError) {
          console.error("Failed to load trip from backend:", fetchError)
        }
      }

      const storedPlan = sessionStorage.getItem("tripPlan")
      if (storedPlan && isMounted) {
        setTripPlan(JSON.parse(storedPlan))
      } else if (isMounted && tripId) {
        setError("We couldn't load that saved trip.")
      }

      if (isMounted) {
        setIsLoading(false)
      }
    }

    loadTrip()

    return () => {
      isMounted = false
    }
  }, [tripId])

  const handleShare = async () => {
    if (!tripPlan) return
    
    try {
      await navigator.share({
        title: `Trip to ${tripPlan.destination}`,
        text: tripPlan.overview,
        url: window.location.href,
      })
    } catch {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Spinner className="h-8 w-8 mx-auto text-primary" />
            <p className="text-muted-foreground">Loading your trip plan...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!tripPlan) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">No Trip Plan Found</h2>
            <p className="text-muted-foreground">
              {error || "Start by creating a new trip plan"}
            </p>
            <Button onClick={() => router.push("/")} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Plan Another Trip
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Download className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        {/* Trip Overview */}
        <TripOverview 
          destination={tripPlan.destination}
          overview={tripPlan.overview}
          bestTimeToVisit={tripPlan.bestTimeToVisit}
          language={tripPlan.language}
          currency={tripPlan.currency}
          totalDays={tripPlan.itinerary.length}
        />

        {/* Day-by-Day Itinerary */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Day-by-Day Itinerary</h2>
          <div className="space-y-6">
            {tripPlan.itinerary.map((day) => (
              <DayItinerary key={day.day} day={day} />
            ))}
          </div>
        </section>

        {/* Cost Breakdown & Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <CostBreakdown costs={tripPlan.totalEstimatedCost} />
          <TravelTips tips={tripPlan.travelTips} />
        </div>

        {/* Packing List */}
        <PackingList items={tripPlan.packingList} />
      </main>

      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>Wanderlust AI - Your AI-Powered Travel Companion</p>
        </div>
      </footer>
    </div>
  )
}
