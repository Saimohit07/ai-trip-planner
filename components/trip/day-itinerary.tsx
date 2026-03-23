"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Clock, DollarSign, Lightbulb, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

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

interface DayItineraryProps {
  day: Day
}

export function DayItinerary({ day }: DayItineraryProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-card border-border overflow-hidden">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-secondary/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                  {day.day}
                </div>
                <div>
                  <CardTitle className="text-foreground text-lg">
                    Day {day.day}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">{day.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="hidden sm:flex">
                  {day.activities.length} activities
                </Badge>
                <ChevronDown 
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

              <div className="space-y-6">
                {day.activities.map((activity, index) => (
                  <div key={index} className="relative pl-10">
                    {/* Timeline dot */}
                    <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />

                    <div className="bg-secondary/30 rounded-lg p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {activity.activity}
                          </h4>
                          <p className="text-muted-foreground text-sm mt-1">
                            {activity.description}
                          </p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className="border-primary/30 text-primary shrink-0"
                        >
                          {activity.time}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{activity.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span>{activity.cost}</span>
                        </div>
                      </div>

                      {activity.tips && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="flex items-start gap-2 text-sm">
                            <Lightbulb className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{activity.tips}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
