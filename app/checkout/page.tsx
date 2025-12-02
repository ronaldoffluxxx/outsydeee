"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Lock, Loader2 } from "lucide-react"

// Mock Data (In real app, fetch based on IDs)
const EVENT = {
    id: "1",
    title: "Neon Nights Festival",
    date: "2024-08-15",
    venue: "Downtown Arena, New York",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1000&auto=format&fit=crop",
}

const TICKET_TYPES = {
    "t1": { name: "General Admission", price: 150 },
    "t2": { name: "VIP Pass", price: 299 },
    "t3": { name: "Backstage Pass", price: 500 },
}

function CheckoutContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const ticketId = searchParams.get("ticketId") as keyof typeof TICKET_TYPES
    const ticket = TICKET_TYPES[ticketId] || TICKET_TYPES["t1"]

    const [loading, setLoading] = useState(false)

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simulate Stripe payment delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        setLoading(false)
        router.push("/dashboard")
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div className="space-y-6">
                    <Card className="bg-spotify-dark border-none text-white">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-4">
                                <div className="h-20 w-20 relative rounded-md overflow-hidden bg-zinc-800">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={EVENT.image} alt={EVENT.title} className="object-cover h-full w-full" />
                                </div>
                                <div>
                                    <h3 className="font-bold">{EVENT.title}</h3>
                                    <p className="text-sm text-zinc-400">{EVENT.date}</p>
                                    <p className="text-sm text-zinc-400">{EVENT.venue}</p>
                                </div>
                            </div>
                            <div className="border-t border-zinc-800 pt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span>{ticket.name} x 1</span>
                                    <span>${ticket.price}</span>
                                </div>
                                <div className="flex justify-between text-zinc-400 text-sm">
                                    <span>Service Fee</span>
                                    <span>$5.00</span>
                                </div>
                                <div className="flex justify-between text-zinc-400 text-sm">
                                    <span>Tax</span>
                                    <span>$12.00</span>
                                </div>
                            </div>
                            <div className="border-t border-zinc-800 pt-4 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${ticket.price + 17}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Payment Form */}
                <div className="space-y-6">
                    <Card className="bg-spotify-dark border-none text-white">
                        <CardHeader>
                            <CardTitle>Payment Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePayment} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Cardholder Name</Label>
                                    <Input className="bg-zinc-800 border-zinc-700 text-white" placeholder="John Doe" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Card Number</Label>
                                    <div className="relative">
                                        <Input className="bg-zinc-800 border-zinc-700 text-white pl-10" placeholder="0000 0000 0000 0000" required />
                                        <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Expiry Date</Label>
                                        <Input className="bg-zinc-800 border-zinc-700 text-white" placeholder="MM/YY" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>CVC</Label>
                                        <Input className="bg-zinc-800 border-zinc-700 text-white" placeholder="123" required />
                                    </div>
                                </div>

                                <Button className="w-full bg-spotify-green text-black font-bold rounded-full py-6 mt-4 hover:scale-105 transition" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Pay ${ticket.price + 17}
                                </Button>

                                <div className="flex items-center justify-center text-xs text-zinc-500 mt-4">
                                    <Lock className="h-3 w-3 mr-1" />
                                    Payments are secure and encrypted
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="text-white text-center p-10">Loading checkout...</div>}>
            <CheckoutContent />
        </Suspense>
    )
}
