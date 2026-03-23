import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DollarSign, Hotel, Utensils, MapPin, Car } from "lucide-react"

interface CostBreakdownProps {
  costs: {
    accommodation: string
    food: string
    activities: string
    transportation: string
    total: string
  }
}

const costItems = [
  { key: "accommodation" as const, label: "Accommodation", icon: Hotel },
  { key: "food" as const, label: "Food & Dining", icon: Utensils },
  { key: "activities" as const, label: "Activities", icon: MapPin },
  { key: "transportation" as const, label: "Transportation", icon: Car },
]

export function CostBreakdown({ costs }: CostBreakdownProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Estimated Costs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {costItems.map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-foreground">{item.label}</span>
            </div>
            <span className="font-medium text-foreground">
              {costs[item.key]}
            </span>
          </div>
        ))}

        <Separator className="my-4" />

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">Total</span>
          <span className="text-lg font-bold text-primary">
            {costs.total}
          </span>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          * Costs are estimates and may vary based on season, availability, and personal choices.
        </p>
      </CardContent>
    </Card>
  )
}
