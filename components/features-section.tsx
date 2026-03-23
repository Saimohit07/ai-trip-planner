import { Sparkles, Clock, DollarSign, Lightbulb, Map, Camera } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Planning",
    description: "Our advanced AI creates personalized itineraries based on your preferences, budget, and travel style.",
  },
  {
    icon: Clock,
    title: "Day-by-Day Schedule",
    description: "Get a detailed timeline with activities, travel times, and optimal routes for each day of your trip.",
  },
  {
    icon: DollarSign,
    title: "Cost Breakdown",
    description: "See estimated costs for accommodations, food, activities, and transportation to plan your budget.",
  },
  {
    icon: Lightbulb,
    title: "Local Tips",
    description: "Discover insider tips, hidden gems, and cultural insights to make your trip unforgettable.",
  },
  {
    icon: Map,
    title: "Smart Routing",
    description: "Efficiently organized activities to minimize travel time and maximize your experience.",
  },
  {
    icon: Camera,
    title: "Destination Images",
    description: "Beautiful photos of each destination and attraction to help you visualize your adventure.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Everything You Need for the Perfect Trip
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our AI considers thousands of factors to create the ideal travel experience for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card 
            key={feature.title}
            className="bg-card border-border hover:border-primary/50 transition-all duration-300 group"
          >
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <feature.icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-foreground">{feature.title}</CardTitle>
              <CardDescription className="text-muted-foreground">
                {feature.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
