import { connectToDatabase, isDatabaseConnected } from "@/server/lib/mongo.mjs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function connectIfConfigured() {
  if (!process.env.MONGODB_URI) {
    return
  }

  try {
    await connectToDatabase()
  } catch (error) {
    console.warn("[api/health] MongoDB unavailable, reporting memory mode.")
    console.warn(error instanceof Error ? error.message : error)
  }
}

export async function GET() {
  await connectIfConfigured()

  return Response.json({
    ok: true,
    database: isDatabaseConnected() ? "mongodb" : "memory",
  })
}
