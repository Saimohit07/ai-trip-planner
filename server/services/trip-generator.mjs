import { createGroq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { z } from "zod"

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

const groq = process.env.GROQ_API_KEY
  ? createGroq({
      apiKey: process.env.GROQ_API_KEY,
    })
  : null

const preferenceThemes = {
  adventure: {
    title: "Active Exploration",
    items: [
      {
        activity: "Scenic trail adventure",
        description: "Explore a high-energy outdoor route with panoramic viewpoints.",
        duration: "3 hours",
        cost: 1800,
        tips: "Carry water and wear comfortable shoes.",
      },
      {
        activity: "Sunrise viewpoint visit",
        description: "Start early for the best light and fewer crowds.",
        duration: "2 hours",
        cost: 900,
        tips: "Leave before sunrise for a smoother experience.",
      },
      {
        activity: "Guided local excursion",
        description: "Join a local guide for an activity tailored to the terrain and culture.",
        duration: "2.5 hours",
        cost: 2200,
        tips: "Book ahead during weekends and holidays.",
      },
    ],
  },
  food: {
    title: "Food Trail",
    items: [
      {
        activity: "Signature breakfast stop",
        description: "Try a well-loved local breakfast spot and regional specialties.",
        duration: "1.5 hours",
        cost: 700,
        tips: "Ask for the chef's popular seasonal item.",
      },
      {
        activity: "Market tasting walk",
        description: "Sample local snacks and ingredients while exploring a lively market.",
        duration: "2 hours",
        cost: 1200,
        tips: "Carry cash for small vendors.",
      },
      {
        activity: "Dinner at a local favorite",
        description: "Wind down with a relaxed meal at a restaurant known for authentic flavors.",
        duration: "2 hours",
        cost: 1600,
        tips: "Reserve ahead for evening seating.",
      },
    ],
  },
  relaxation: {
    title: "Slow Travel",
    items: [
      {
        activity: "Cafe and neighborhood stroll",
        description: "Ease into the day with coffee and a leisurely walk through a charming district.",
        duration: "2 hours",
        cost: 600,
        tips: "Pick a quieter morning slot for the best atmosphere.",
      },
      {
        activity: "Spa or wellness break",
        description: "Take a restorative pause with a massage, spa session, or quiet retreat.",
        duration: "2 hours",
        cost: 2500,
        tips: "Check same-day availability in advance.",
      },
      {
        activity: "Sunset unwind session",
        description: "End the day at a peaceful spot with scenic views and minimal rush.",
        duration: "1.5 hours",
        cost: 500,
        tips: "Bring a light layer for the evening breeze.",
      },
    ],
  },
  culture: {
    title: "Culture and Heritage",
    items: [
      {
        activity: "Historic district walk",
        description: "Explore heritage streets, architecture, and local stories.",
        duration: "2 hours",
        cost: 800,
        tips: "A local guide can add useful historical context.",
      },
      {
        activity: "Museum or gallery visit",
        description: "Spend time with curated exhibits connected to the destination's identity.",
        duration: "2 hours",
        cost: 900,
        tips: "Check for discounted weekday tickets.",
      },
      {
        activity: "Traditional performance",
        description: "Experience music, dance, or storytelling rooted in local culture.",
        duration: "1.5 hours",
        cost: 1400,
        tips: "Arrive early for better seating.",
      },
    ],
  },
  nature: {
    title: "Nature Escape",
    items: [
      {
        activity: "Botanical garden or park visit",
        description: "Enjoy open green spaces and quieter corners of the destination.",
        duration: "2 hours",
        cost: 400,
        tips: "Mornings are usually cooler and less crowded.",
      },
      {
        activity: "Waterfront or lakeside walk",
        description: "Take in natural scenery on an easy-paced route.",
        duration: "1.5 hours",
        cost: 300,
        tips: "Ideal for photos around golden hour.",
      },
      {
        activity: "Day trip to a scenic spot",
        description: "Head slightly outside the city for a stronger dose of nature.",
        duration: "4 hours",
        cost: 2400,
        tips: "Plan transport ahead if public options are limited.",
      },
    ],
  },
  nightlife: {
    title: "Evening Highlights",
    items: [
      {
        activity: "Rooftop or live-music venue",
        description: "Experience the destination's social side with views or performances.",
        duration: "2 hours",
        cost: 1800,
        tips: "Smart-casual outfits often work best.",
      },
      {
        activity: "Night market visit",
        description: "Browse stalls, snacks, and local crafts after dark.",
        duration: "2 hours",
        cost: 900,
        tips: "Keep small change handy.",
      },
      {
        activity: "Late-evening city walk",
        description: "See the city's landmarks lit up with a different atmosphere.",
        duration: "1.5 hours",
        cost: 300,
        tips: "Stay in well-trafficked areas and use ride apps late at night.",
      },
    ],
  },
}

function formatRupees(amount) {
  return `Rs. ${new Intl.NumberFormat("en-IN").format(Math.round(amount))}`
}

function parseBudgetToDailyAmount(budget) {
  if (budget === "low") return 6000
  if (budget === "medium") return 12000
  if (budget === "high") return 22000

  const numericBudget = Number(String(budget).replace(/[^\d.]/g, ""))
  return Number.isFinite(numericBudget) && numericBudget > 0 ? numericBudget : 10000
}

function buildFallbackTrip({ destination, days, preferences, budget }) {
  const normalizedDays = Math.min(Math.max(Number(days) || 3, 1), 14)
  const selectedPreferences =
    preferences?.length > 0
      ? preferences.filter((item) => item in preferenceThemes)
      : ["culture", "food", "nature"]
  const safePreferences = selectedPreferences.length > 0 ? selectedPreferences : ["culture", "food", "nature"]
  const dailyBudget = parseBudgetToDailyAmount(budget)
  const totalBudget = dailyBudget * normalizedDays

  const itinerary = Array.from({ length: normalizedDays }, (_, index) => {
    const morningTheme = preferenceThemes[safePreferences[index % safePreferences.length]]
    const afternoonTheme =
      preferenceThemes[safePreferences[(index + 1) % safePreferences.length]]
    const eveningTheme =
      preferenceThemes[safePreferences[(index + 2) % safePreferences.length]]

    const dayNumber = index + 1
    const activities = [
      {
        time: "9:00 AM",
        activity: `${morningTheme.items[0].activity} in ${destination}`,
        description: morningTheme.items[0].description,
        duration: morningTheme.items[0].duration,
        cost: formatRupees(morningTheme.items[0].cost),
        tips: morningTheme.items[0].tips,
      },
      {
        time: "1:00 PM",
        activity: `${afternoonTheme.items[1].activity} near the city center`,
        description: afternoonTheme.items[1].description,
        duration: afternoonTheme.items[1].duration,
        cost: formatRupees(afternoonTheme.items[1].cost),
        tips: afternoonTheme.items[1].tips,
      },
      {
        time: "6:30 PM",
        activity: `${eveningTheme.items[2].activity} and local discovery`,
        description: eveningTheme.items[2].description,
        duration: eveningTheme.items[2].duration,
        cost: formatRupees(eveningTheme.items[2].cost),
        tips: eveningTheme.items[2].tips,
      },
    ]

    return {
      day: dayNumber,
      title: `${morningTheme.title} Day ${dayNumber}`,
      activities,
    }
  })

  return tripPlanSchema.parse({
    destination,
    overview: `${destination} offers a balanced mix of iconic highlights, neighborhood discoveries, and flexible pacing. This itinerary is tailored around ${safePreferences.join(", ")} interests while keeping the plan practical and easy to follow.`,
    bestTimeToVisit: "October to March",
    language: "English and the local language",
    currency: "Indian Rupee (INR)",
    itinerary,
    totalEstimatedCost: {
      accommodation: `${formatRupees(totalBudget * 0.4)} total`,
      food: `${formatRupees(totalBudget * 0.2)} total`,
      activities: `${formatRupees(totalBudget * 0.22)} total`,
      transportation: `${formatRupees(totalBudget * 0.18)} total`,
      total: `${formatRupees(totalBudget)} total`,
    },
    travelTips: [
      "Start major sightseeing early to avoid peak crowds.",
      "Keep a small buffer in your daily budget for transport changes and local finds.",
      "Save key addresses offline in maps before heading out.",
      "Use one flexible evening slot for anything you discover on the trip.",
    ],
    packingList: [
      "Comfortable walking shoes",
      "Portable charger",
      "Reusable water bottle",
      "Weather-appropriate layers",
      "ID and digital copies of bookings",
    ],
  })
}

function buildPrompt({ destination, days, budget, preferences }) {
  const budgetDescription =
    budget === "low"
      ? "budget-friendly (Rs. 4,000-8,000 per day)"
      : budget === "medium"
        ? "moderate (Rs. 8,000-16,000 per day)"
        : budget === "high"
          ? "luxury (Rs. 16,000+ per day)"
          : `custom budget of ${budget} per day`

  const preferencesText =
    preferences?.length > 0
      ? `The traveler is particularly interested in: ${preferences.join(", ")}.`
      : ""

  return `Create a detailed ${days}-day travel itinerary for ${destination}.

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
}

function parseModelResponse(text) {
  let jsonText = text.trim()

  if (jsonText.startsWith("```json")) {
    jsonText = jsonText.slice(7)
  } else if (jsonText.startsWith("```")) {
    jsonText = jsonText.slice(3)
  }

  if (jsonText.endsWith("```")) {
    jsonText = jsonText.slice(0, -3)
  }

  return tripPlanSchema.parse(JSON.parse(jsonText.trim()))
}

export async function generateTripPlan(input) {
  const destination = input?.destination?.trim()
  const days = Number(input?.days)
  const budget = input?.budget
  const preferences = Array.isArray(input?.preferences) ? input.preferences : []

  if (!destination || !days || !budget) {
    throw new Error("Missing required fields: destination, days, and budget are required")
  }

  if (!groq) {
    return buildFallbackTrip({ destination, days, preferences, budget })
  }

  try {
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: buildPrompt({ destination, days, budget, preferences }),
      maxOutputTokens: 4000,
      temperature: 0.7,
    })

    return parseModelResponse(text)
  } catch (error) {
    console.warn("[server] Groq generation failed, using fallback itinerary.")
    console.warn(error instanceof Error ? error.message : error)
    return buildFallbackTrip({ destination, days, preferences, budget })
  }
}
