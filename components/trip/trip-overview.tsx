"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buildApiUrl } from "@/lib/api"
import { MapPin, Calendar, Globe, Banknote, Sparkles } from "lucide-react"

interface TripOverviewProps {
  destination: string
  overview: string
  bestTimeToVisit: string
  language: string
  currency: string
  totalDays: number
}

export function TripOverview({
  destination,
  overview,
  bestTimeToVisit,
  language,
  currency,
  totalDays,
}: TripOverviewProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    async function fetchImage() {
      try {
        const response = await fetch(
          buildApiUrl(`/api/images?query=${encodeURIComponent(destination + " travel")}`)
        )
        if (response.ok) {
          const data = await response.json()
          if (data.imageUrl) {
            setImageUrl(data.imageUrl)
          }
        }
      } catch (error) {
        console.error("Failed to fetch image:", error)
      }
    }
    fetchImage()
  }, [destination])

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="relative h-64 md:h-80">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${destination} landscape`}
            fill
            className="object-cover"
            crossOrigin="anonymous"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <MapPin className="h-16 w-16 text-primary/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <Badge className="bg-primary text-primary-foreground mb-3">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Generated Itinerary
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            {destination}
          </h1>
        </div>
      </div>

      <CardContent className="p-6">
        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
          {overview}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="text-sm font-medium text-foreground">{totalDays} Days</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Language</p>
              <p className="text-sm font-medium text-foreground">{language}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Banknote className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Currency</p>
              <p className="text-sm font-medium text-foreground">{currency}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <MapPin className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Best Time</p>
              <p className="text-sm font-medium text-foreground">{bestTimeToVisit}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
