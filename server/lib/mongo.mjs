import mongoose from "mongoose"

let connectionPromise = null

export async function connectToDatabase() {
  const connectionString = process.env.MONGODB_URI

  if (!connectionString) {
    throw new Error("MONGODB_URI is not configured")
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(connectionString, {
        dbName: process.env.MONGODB_DB || "trip_planner",
      })
      .catch((error) => {
        connectionPromise = null
        throw error
      })
  }

  await connectionPromise
  return mongoose.connection
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1
}
