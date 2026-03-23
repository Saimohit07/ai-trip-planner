import mongoose from "mongoose"

const activitySchema = new mongoose.Schema(
  {
    time: { type: String, required: true },
    activity: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    cost: { type: String, required: true },
    tips: { type: String, default: null },
  },
  { _id: false }
)

const daySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    activities: { type: [activitySchema], required: true },
  },
  { _id: false }
)

const tripSchema = new mongoose.Schema(
  {
    destination: { type: String, required: true },
    overview: { type: String, required: true },
    bestTimeToVisit: { type: String, required: true },
    language: { type: String, required: true },
    currency: { type: String, required: true },
    itinerary: { type: [daySchema], required: true },
    totalEstimatedCost: {
      accommodation: { type: String, required: true },
      food: { type: String, required: true },
      activities: { type: String, required: true },
      transportation: { type: String, required: true },
      total: { type: String, required: true },
    },
    travelTips: { type: [String], required: true },
    packingList: { type: [String], required: true },
  },
  {
    collection: "trips",
    timestamps: true,
  }
)

export const Trip = mongoose.models.Trip || mongoose.model("Trip", tripSchema)
