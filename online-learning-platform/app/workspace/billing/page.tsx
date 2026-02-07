"use client"
import React from "react"
import { CreditCard, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  { name: "Free", price: "$0", desc: "Access to free courses", features: ["5 courses", "Basic support"], current: true },
  { name: "Pro", price: "$19/mo", desc: "Unlimited learning", features: ["Unlimited courses", "Priority support"], current: false },
  { name: "Team", price: "$49/mo", desc: "For teams", features: ["Everything in Pro", "Team dashboard"], current: false },
]

export default function BillingPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Subscription and Pricing</h1>
      <p className="text-gray-500 mb-8">Choose the plan that fits you.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div key={p.name} className="border rounded-lg p-6 bg-white shadow-sm">
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
            <Button className="w-full mt-6" variant={p.current ? "secondary" : "default"}>
              {p.current ? "Current Plan" : "Upgrade"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
