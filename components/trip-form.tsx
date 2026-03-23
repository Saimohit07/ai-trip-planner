"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"
import { buildApiUrl } from "@/lib/api"
import { MapPin, Calendar, Wallet, Sparkles } from "lucide-react"

const preferences = [
  { id: "adventure", label: "Adventure" },
  { id: "food", label: "Food & Cuisine" },
  { id: "relaxation", label: "Relaxation" },
  { id: "culture", label: "Culture & History" },
  { id: "nature", label: "Nature" },
  { id: "nightlife", label: "Nightlife" },
]

export function TripForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    budget: "",
    customBudget: "",
    preferences: [] as string[],
  })
  const [error, setError] = useState("")

  const handlePreferenceChange = (preferenceId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      preferences: checked
        ? [...prev.preferences, preferenceId]
        : prev.preferences.filter((p) => p !== preferenceId),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.destination.trim()) {
      setError("Please enter a destination")
      return
    }

    if (!formData.days || parseInt(formData.days) < 1) {
      setError("Please enter a valid number of days")
      return
    }

    if (!formData.budget) {
      setError("Please select a budget")
      return
    }

    if (formData.budget === "custom" && !formData.customBudget) {
      setError("Please enter a custom budget amount")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(buildApiUrl("/api/trips/generate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: formData.destination,
          days: parseInt(formData.days),
          budget: formData.budget === "custom" ? formData.customBudget : formData.budget,
          preferences: formData.preferences,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate trip")
      }

      const data = await response.json()
      
      // Store the trip data in sessionStorage for the results page
      sessionStorage.setItem("tripPlan", JSON.stringify(data.trip))
      router.push(data.id ? `/trip?id=${data.id}` : "/trip")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="destination" className="text-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          Destination
        </Label>
        <Input
          id="destination"
          placeholder="e.g., Paris, Tokyo, New York..."
          value={formData.destination}
          onChange={(e) => setFormData((prev) => ({ ...prev, destination: e.target.value }))}
          className="bg-input border-border text-foreground placeholder:text-muted-foreground"
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="days" className="text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Number of Days
          </Label>
          <Input
            id="days"
            type="number"
            min="1"
            max="30"
            placeholder="e.g., 5"
            value={formData.days}
            onChange={(e) => setFormData((prev) => ({ ...prev, days: e.target.value }))}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget" className="text-foreground flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            Budget
          </Label>
          <Select
            value={formData.budget}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, budget: value }))}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Budget-Friendly (Rs. 4,000-8,000/day)</SelectItem>
              <SelectItem value="medium">Moderate (Rs. 8,000-16,000/day)</SelectItem>
              <SelectItem value="high">Luxury (Rs. 16,000+/day)</SelectItem>
              <SelectItem value="custom">Custom Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {formData.budget === "custom" && (
        <div className="space-y-2">
          <Label htmlFor="customBudget" className="text-foreground">
            Custom Budget (per day)
          </Label>
          <Input
            id="customBudget"
            placeholder="e.g., Rs. 10,000"
            value={formData.customBudget}
            onChange={(e) => setFormData((prev) => ({ ...prev, customBudget: e.target.value }))}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            disabled={isLoading}
          />
        </div>
      )}

      <div className="space-y-3">
        <Label className="text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Travel Preferences (Optional)
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {preferences.map((pref) => (
            <div key={pref.id} className="flex items-center space-x-2">
              <Checkbox
                id={pref.id}
                checked={formData.preferences.includes(pref.id)}
                onCheckedChange={(checked) =>
                  handlePreferenceChange(pref.id, checked as boolean)
                }
                disabled={isLoading}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={pref.id}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                {pref.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Generating Your Trip...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate AI Trip Plan
          </>
        )}
      </Button>
    </form>
  )
}
