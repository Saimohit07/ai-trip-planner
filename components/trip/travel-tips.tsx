import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, CheckCircle2 } from "lucide-react"

interface TravelTipsProps {
  tips: string[]
}

export function TravelTips({ tips }: TravelTipsProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent" />
          Travel Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{tip}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
