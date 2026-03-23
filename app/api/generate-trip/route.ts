import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { z } from "zod"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

const activitySchema = z.object({
  time: z.string(),
  activity: z.string(),
  description: z.string(),
  duration: z.string(),
  cost: z.string(),
  tips: z.string().nullable(),
})

const daySchema = z.object({
  day: z.number(),
  title: z.string(),
  activities: z.array(activitySchema),
})

const tripPlanSchema = z.object({
  destination: z.string(),
  overview: z.string(),
  bestTimeToVisit: z.string(),
  language: z.string(),
  currency: z.string(),
  itinerary: z.array(daySchema),
  totalEstimatedCost: z.object({
    accommodation: z.string(),
    food: z.string(),
    activities: z.string(),
    transportation: z.string(),
    total: z.string(),
  }),
  travelTips: z.array(z.string()),
  packingList: z.array(z.string()),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { destination, days, budget, preferences } = body

    console.log("[v0] Received request:", { destination, days, budget, preferences })

    if (!destination || !days || !budget) {
      return Response.json(
        { error: "Missing required fields: destination, days, and budget are required" },
        { status: 400 }
      )
    }

    const budgetDescription = 
      budget === "low" ? "budget-friendly (Rs. 4,000-8,000 per day)" :
      budget === "medium" ? "moderate (Rs. 8,000-16,000 per day)" :
      budget === "high" ? "luxury (Rs. 16,000+ per day)" :
      `custom budget of ${budget} per day`

    const preferencesText = preferences?.length > 0 
      ? `The traveler is particularly interested in: ${preferences.join(", ")}.`
      : ""

    const prompt = `Create a detailed ${days}-day travel itinerary for ${destination}.

Budget: ${budgetDescription}
${preferencesText}

IMPORTANT: All costs and prices MUST be in Indian Rupees (Rs. or INR). Use the Rs. symbol.

You MUST respond with ONLY a valid JSON object (no markdown, no code blocks, no explanations, just the raw JSON). Use this exact structure:
{
  "destination": "City, Country",
  "overview": "Brief 2-3 sentence overview of the destination and what makes it special",
  "bestTimeToVisit": "Best months/season to visit",
  "language": "Primary language spoken",
  "currency": "Indian Rupee (INR)",
  "itinerary": [
    {
      "day": 1,
      "title": "Theme for the day",
      "activities": [
        {
          "time": "9:00 AM",
          "activity": "Activity name",
          "description": "What you'll do and see",
          "duration": "2 hours",
          "cost": "Rs. 500",
          "tips": "Helpful tip or null"
        }
      ]
    }
  ],
  "totalEstimatedCost": {
    "accommodation": "Rs. XX,XXX total",
    "food": "Rs. XX,XXX total",
    "activities": "Rs. XX,XXX total",
    "transportation": "Rs. XX,XXX total",
    "total": "Rs. XX,XXX total"
  },
  "travelTips": ["Tip 1", "Tip 2", "Tip 3"],
  "packingList": ["Item 1", "Item 2", "Item 3"]
}

Include 3-5 activities per day with realistic timing. Mix popular attractions with local hidden gems. Remember ALL costs in Indian Rupees.`

    console.log("[v0] Calling Groq API...")

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
      maxOutputTokens: 4000,
      temperature: 0.7,
    })

    console.log("[v0] Groq response received, length:", text.length)

    // Parse the JSON response
    let jsonText = text.trim()
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.slice(7)
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.slice(3)
    }
    if (jsonText.endsWith("```")) {
      jsonText = jsonText.slice(0, -3)
    }
    jsonText = jsonText.trim()

    console.log("[v0] Parsing JSON...")
    
    const parsed = JSON.parse(jsonText)
    const validated = tripPlanSchema.parse(parsed)

    console.log("[v0] Successfully generated trip plan for:", validated.destination)

    return Response.json(validated)
  } catch (error) {
    console.error("[v0] Error generating trip:", error)
    
    // Return more detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return Response.json(
      { error: `Failed to generate trip plan: ${errorMessage}` },
      { status: 500 }
    )
  }
}
