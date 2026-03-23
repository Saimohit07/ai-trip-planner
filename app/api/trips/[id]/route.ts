import { connectToDatabase } from "@/server/lib/mongo.mjs"
import { getTripById } from "@/server/lib/trip-store.mjs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function connectIfConfigured() {
  if (!process.env.MONGODB_URI) {
    return
  }

  try {
    await connectToDatabase()
  } catch (error) {
    console.warn("[api/trips/[id]] MongoDB unavailable, checking in-memory trip storage.")
    console.warn(error instanceof Error ? error.message : error)
  }
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectIfConfigured()

    const { id } = await context.params
    const trip = await getTripById(id)

    if (!trip) {
      return Response.json({ error: "Trip not found" }, { status: 404 })
    }

    return Response.json({
      id,
      trip,
    })
  } catch (error) {
    console.error("[api/trips/[id]] Failed to fetch trip:", error)
    const message = error instanceof Error ? error.message : "Unknown error"

    return Response.json(
      { error: `Failed to fetch trip: ${message}` },
      { status: 500 }
    )
  }
}
