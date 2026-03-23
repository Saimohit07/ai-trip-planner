"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Briefcase } from "lucide-react"

interface PackingListProps {
  items: string[]
}

export function PackingList({ items }: PackingListProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  const toggleItem = (item: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (next.has(item)) {
        next.delete(item)
      } else {
        next.add(item)
      }
      return next
    })
  }

  const checkedCount = checkedItems.size
  const totalCount = items.length

  return (
    <Card className="bg-card border-border mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Packing List
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {checkedCount}/{totalCount} packed
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/30 transition-colors"
            >
              <Checkbox
                id={`pack-${index}`}
                checked={checkedItems.has(item)}
                onCheckedChange={() => toggleItem(item)}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`pack-${index}`}
                className={`cursor-pointer text-sm ${
                  checkedItems.has(item)
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                }`}
              >
                {item}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
