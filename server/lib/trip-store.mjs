import crypto from "node:crypto"
import mongoose from "mongoose"
import { Trip } from "../models/Trip.mjs"

const inMemoryTrips = new Map()

function stripTripMetadata(trip) {
  if (!trip) {
    return null
  }

  const {
    _id: _unusedId,
    __v: _unusedVersion,
    createdAt: _unusedCreatedAt,
    updatedAt: _unusedUpdatedAt,
    ...tripData
  } = trip

  return tripData
}

export async function saveTrip(trip) {
  if (mongoose.connection.readyState === 1) {
    const savedTrip = await Trip.create(trip)

    return {
      id: savedTrip._id.toString(),
      trip: stripTripMetadata(savedTrip.toObject()),
    }
  }

  const id = crypto.randomUUID()
  inMemoryTrips.set(id, trip)

  return {
    id,
    trip,
  }
}

export async function getTripById(id) {
  if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
    const trip = await Trip.findById(id).lean()
    if (trip) {
      return stripTripMetadata(trip)
    }
  }

  return inMemoryTrips.get(id) || null
}
