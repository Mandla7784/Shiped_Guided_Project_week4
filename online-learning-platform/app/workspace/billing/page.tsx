"use client"
import React, { useEffect, useState } from "react"
import { CreditCard, Check, Loader2, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import axios from "axios"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const plans = [
  { 
    name: "Free", 
    id: "free", 
    price: "$0", 
    desc: "Access to free courses", 
    features: ["5 courses", "Basic support"]
  },
  { 
    name: "Pro", 
    id: "pro", 
    price: "$19/mo", 
    desc: "Unlimited learning", 
    features: ["Unlimited courses", "Priority support"]
  },
  { 
    name: "Team", 
    id: "team", 
    price: "$49/mo", 
    desc: "For teams", 
    features: ["Everything in Pro", "Team dashboard"]
  },
]

export default function BillingPage() {
  const [currentSubscription, setCurrentSubscription] = useState<string>("free")
  const [loading, setLoading] = useState(true)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null)
  const [processing, setProcessing] = useState(false)
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })
  const router = useRouter()

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

  const handleDowngradeToFree = async () => {
    try {
      await axios.post("/api/subscription", { subscription: "free" })
      setCurrentSubscription("free")
      alert("Successfully downgraded to free plan!")
      router.refresh()
    } catch (error: unknown) {
      console.error("Error updating subscription:", error)
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : "Failed to update subscription. Please try again."
      alert(errorMessage)
    }
  }

  const handleUpgradeClick = (plan: typeof plans[0]) => {
    if (plan.id === "free") {
      handleDowngradeToFree()
      return
    }
    setSelectedPlan(plan)
    setPaymentDialogOpen(true)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlan) return

    setProcessing(true)
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    try {
      // Update subscription in database (no actual payment processed)
      await axios.post("/api/subscription", { subscription: selectedPlan.id })
      setCurrentSubscription(selectedPlan.id)
      
      // Close dialog and reset form
      setPaymentDialogOpen(false)
      setPaymentData({ cardNumber: "", expiryDate: "", cvv: "", cardName: "" })
      
      // Show success message
      alert(`Successfully subscribed to ${selectedPlan.name} plan!`)
      router.refresh()
    } catch (error: unknown) {
      console.error("Error processing subscription:", error)
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : "Failed to process subscription. Please try again."
      alert(errorMessage)
    } finally {
      setProcessing(false)
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
              
              {/* Subscribe Button */}
              <SignedIn>
                <Button 
                  className="w-full mt-6" 
                  variant={isCurrent ? "secondary" : "default"}
                  onClick={() => handleUpgradeClick(p)}
                  disabled={isCurrent}
                >
                  {isCurrent ? (
                    "Current Plan"
                  ) : p.id === "free" ? (
                    "Downgrade to Free"
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Subscribe - {p.price}
                    </>
                  )}
                </Button>
              </SignedIn>
              
              <SignedOut>
                <Button 
                  className="w-full mt-6" 
                  variant="outline"
                  onClick={() => router.push("/sign-in")}
                >
                  Sign in to Subscribe
                </Button>
              </SignedOut>
            </div>
          )
        })}
      </div>
      
      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-600" />
              Complete Payment
            </DialogTitle>
            <DialogDescription>
              Subscribe to {selectedPlan?.name} plan for {selectedPlan?.price}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={paymentData.cardName}
                onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                required
                disabled={processing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={(e) => setPaymentData({ ...paymentData, cardNumber: formatCardNumber(e.target.value) })}
                maxLength={19}
                required
                disabled={processing}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChange={(e) => setPaymentData({ ...paymentData, expiryDate: formatExpiryDate(e.target.value) })}
                  maxLength={5}
                  required
                  disabled={processing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  type="password"
                  value={paymentData.cvv}
                  onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                  maxLength={4}
                  required
                  disabled={processing}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
              <Lock className="w-4 h-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setPaymentDialogOpen(false)
                  setPaymentData({ cardNumber: "", expiryDate: "", cvv: "", cardName: "" })
                }}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Pay {selectedPlan?.price}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Demo Mode Notice */}
      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>Demo Mode:</strong> This is a demonstration billing system. No actual payments are processed. 
          Subscriptions are updated directly in the database for testing purposes.
        </p>
      </div>
    </div>
  )
}
