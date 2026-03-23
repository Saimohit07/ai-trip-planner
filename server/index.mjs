import "dotenv/config"
import cors from "cors"
import express from "express"
import { connectToDatabase, isDatabaseConnected } from "./lib/mongo.mjs"
import { getTripById, saveTrip } from "./lib/trip-store.mjs"
import { getImageForQuery } from "./services/image-service.mjs"
import { generateTripPlan } from "./services/trip-generator.mjs"

const app = express()
const port = Number(process.env.PORT || 5000)
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error("Origin not allowed by CORS"))
    },
  })
)
app.use(express.json({ limit: "1mb" }))

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    database: isDatabaseConnected() ? "mongodb" : "memory",
  })
})

app.post("/api/trips/generate", async (req, res) => {
  try {
    const trip = await generateTripPlan(req.body)
    const savedTrip = await saveTrip(trip)

    res.json(savedTrip)
  } catch (error) {
    console.error("[server] Failed to generate trip:", error)
    const message = error instanceof Error ? error.message : "Unknown error"

    res.status(500).json({
      error: `Failed to generate trip plan: ${message}`,
    })
  }
})

app.get("/api/trips/:id", async (req, res) => {
  try {
    const trip = await getTripById(req.params.id)

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" })
    }

    return res.json({
      id: req.params.id,
      trip,
    })
  } catch (error) {
    console.error("[server] Failed to fetch trip:", error)
    const message = error instanceof Error ? error.message : "Unknown error"

    return res.status(500).json({
      error: `Failed to fetch trip: ${message}`,
    })
  }
})

app.get("/api/images", async (req, res) => {
  const query = typeof req.query.query === "string" ? req.query.query : ""

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" })
  }

  try {
    const image = await getImageForQuery(query)
    return res.json(image)
  } catch (error) {
    console.error("[server] Failed to fetch image:", error)
    return res.status(500).json({ error: "Failed to fetch image" })
  }
})

async function start() {
  try {
    await connectToDatabase()
  } catch (error) {
    console.warn("[server] MongoDB unavailable, using in-memory trip storage.")
    console.warn(error instanceof Error ? error.message : error)
  }

  app.listen(port, () => {
    console.log(`[server] API listening on http://localhost:${port}`)
  })
}

start()
