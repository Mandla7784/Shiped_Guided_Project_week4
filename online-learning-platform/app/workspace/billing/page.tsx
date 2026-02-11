"use client"
import React, { useEffect, useState } from "react"
import { CreditCard, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "axios"

const plans = [
  { name: "Free", id: "free", price: "$0", desc: "Access to free courses", features: ["5 courses", "Basic support"] },
  { name: "Pro", id: "pro", price: "$19/mo", desc: "Unlimited learning", features: ["Unlimited courses", "Priority support"] },
  { name: "Team", id: "team", price: "$49/mo", desc: "For teams", features: ["Everything in Pro", "Team dashboard"] },
]

export default function BillingPage() {
  const [currentSubscription, setCurrentSubscription] = useState<string>("free")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      const { data } = await axios.get("/api/subscription")
      setCurrentSubscription(data.subscription || "free")
    } catch (error) {
      console.error("Error fetching subscription:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (planId: string) => {
    if (planId === currentSubscription) return
    
    setUpdating(planId)
    try {
      await axios.post("/api/subscription", { subscription: planId })
      setCurrentSubscription(planId)
      alert(`Successfully ${planId === "free" ? "downgraded" : "upgraded"} to ${planId} plan!`)
    } catch (error: any) {
      console.error("Error updating subscription:", error)
      alert(error.response?.data?.error || "Failed to update subscription. Please try again.")
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Subscription and Pricing</h1>
      <p className="text-gray-500 mb-8">Choose the plan that fits you.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isCurrent = p.id === currentSubscription
          const isUpdating = updating === p.id
          return (
            <div key={p.id} className="border rounded-lg p-6 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold">{p.name}</h2>
              </div>
              <p className="text-2xl font-bold text-purple-600">{p.price}</p>
              <p className="text-sm text-gray-500 mt-1">{p.desc}</p>
              <ul className="mt-4 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full mt-6" 
                variant={isCurrent ? "secondary" : "default"}
                onClick={() => handleUpgrade(p.id)}
                disabled={isCurrent || isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : isCurrent ? (
                  "Current Plan"
                ) : (
                  p.id === "free" ? "Downgrade" : "Upgrade"
                )}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
