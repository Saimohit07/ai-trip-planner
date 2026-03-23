import { connectToDatabase } from "@/server/lib/mongo.mjs"
import { saveTrip } from "@/server/lib/trip-store.mjs"
import { generateTripPlan } from "@/server/services/trip-generator.mjs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function connectIfConfigured() {
  if (!process.env.MONGODB_URI) {
    return
  }

  try {
    await connectToDatabase()
  } catch (error) {
    console.warn("[api/trips/generate] MongoDB unavailable, using in-memory trip storage.")
    console.warn(error instanceof Error ? error.message : error)
  }
}

export async function POST(req: Request) {
  try {
    await connectIfConfigured()

    const trip = await generateTripPlan(await req.json())
    const savedTrip = await saveTrip(trip)

    return Response.json(savedTrip)
  } catch (error) {
    console.error("[api/trips/generate] Failed to generate trip:", error)
    const message = error instanceof Error ? error.message : "Unknown error"

    return Response.json(
      { error: `Failed to generate trip plan: ${message}` },
      { status: 500 }
    )
  }
}
