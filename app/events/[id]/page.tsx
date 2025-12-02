"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, Share2, Heart, ArrowLeft, Navigation } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { useCurrency } from "@/components/providers/currency-provider"
import { toast } from "sonner"

// Mock Data
const EVENT = {
    id: "1",
    title: "Neon Nights Festival",
    description: "Experience the ultimate electronic music festival under the stars. Featuring top DJs from around the world, immersive light shows, and an unforgettable atmosphere. Join us for a night of dance, music, and memories.",
    date: "2024-08-15",
    time: "20:00",
    venue: "Downtown Arena, New York",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1000&auto=format&fit=crop",
    organizer: "Electric Dreams Co.",
    ticketTypes: [
        { id: "t1", name: "General Admission", price: 150, description: "Access to main stage and food court" },
        { id: "t2", name: "VIP Pass", price: 299, description: "Priority entry, VIP lounge access, free drinks" },
        { id: "t3", name: "Backstage Pass", price: 500, description: "Meet & Greet, Backstage access, All VIP perks" },
    ]
}

export default function EventDetailsPage({ params }: { params: { id: string } }) {
    const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
    const { formatPrice } = useCurrency()

    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(EVENT.venue)}`
    // Note: Since we don't have a real API key, we'll use a standard embed iframe for now or a placeholder
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENT.venue)}`

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <Link href="/events" className="inline-flex items-center text-zinc-400 hover:text-white mb-6 transition">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                        <Image
                            src={EVENT.image}
                            alt={EVENT.title}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                            <Button
                                size="icon"
                                variant="secondary"
                                className="rounded-full bg-black/50 hover:bg-black/70 text-white border-none"
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: EVENT.title,
                                            text: EVENT.description,
                                            url: window.location.href,
                                        })
                                    } else {
                                        navigator.clipboard.writeText(window.location.href)
                                        toast.success("Link copied to clipboard")
                                    }
                                }}
                            >
                                <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="secondary"
                                className="rounded-full bg-black/50 hover:bg-black/70 text-white border-none"
                                onClick={() => {
                                    toast.success("Added to favorites")
                                    // TODO: Implement actual Supabase favorite toggle
                                }}
                            >
                                <Heart className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">{EVENT.title}</h1>
                        <p className="text-zinc-400 text-lg">by <span className="text-spotify-green font-bold hover:underline cursor-pointer">{EVENT.organizer}</span></p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-spotify-dark border-none text-white">
                            <CardContent className="p-4 flex items-center">
                                <Calendar className="h-8 w-8 text-spotify-green mr-4" />
                                <div>
                                    <p className="text-xs text-zinc-400 uppercase font-bold">Date</p>
                                    <p className="font-bold">{new Date(EVENT.date).toLocaleDateString()}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-spotify-dark border-none text-white">
                            <CardContent className="p-4 flex items-center">
                                <Clock className="h-8 w-8 text-blue-500 mr-4" />
                                <div>
                                    <p className="text-xs text-zinc-400 uppercase font-bold">Time</p>
                                    <p className="font-bold">{EVENT.time}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-spotify-dark border-none text-white">
                            <CardContent className="p-4 flex items-center">
                                <MapPin className="h-8 w-8 text-red-500 mr-4" />
                                <div>
                                    <p className="text-xs text-zinc-400 uppercase font-bold">Venue</p>
                                    <p className="font-bold truncate">{EVENT.venue}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">About Event</h2>
                        <p className="text-zinc-300 leading-relaxed">{EVENT.description}</p>
                    </div>

                    {/* Map Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Location</h2>
                            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="border-spotify-green text-spotify-green hover:bg-spotify-green hover:text-black rounded-full">
                                    <Navigation className="h-4 w-4 mr-2" />
                                    Get Directions
                                </Button>
                            </a>
                        </div>
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-800 relative">
                            <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(EVENT.venue)}`}
                            >
                            </iframe>
                            {/* Fallback since we don't have an API key */}
                            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/90 text-center p-6">
                                <div>
                                    <MapPin className="h-12 w-12 text-spotify-green mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">{EVENT.venue}</h3>
                                    <p className="text-zinc-400 mb-4">Click 'Get Directions' to view on Google Maps</p>
                                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                                        <Button className="bg-spotify-green text-black font-bold rounded-full">
                                            Open in Maps
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Ticket Selection */}
                <div className="space-y-6">
                    <Card className="bg-spotify-dark border-zinc-800 text-white sticky top-24">
                        <CardContent className="p-6 space-y-6">
                            <h3 className="text-xl font-bold">Select Tickets</h3>
                            <div className="space-y-3">
                                {EVENT.ticketTypes.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        onClick={() => setSelectedTicket(ticket.id)}
                                        className={`p-4 rounded-lg border cursor-pointer transition ${selectedTicket === ticket.id
                                            ? "border-spotify-green bg-spotify-green/10"
                                            : "border-zinc-700 hover:border-zinc-500"
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold">{ticket.name}</span>
                                            <span className="font-bold text-spotify-green">{formatPrice(ticket.price)}</span>
                                        </div>
                                        <p className="text-xs text-zinc-400">{ticket.description}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-zinc-800">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-zinc-400">Total</span>
                                    <span className="text-2xl font-bold">
                                        {selectedTicket ? formatPrice(EVENT.ticketTypes.find(t => t.id === selectedTicket)?.price || 0) : formatPrice(0)}
                                    </span>
                                </div>
                                <Link href={`/checkout?eventId=${EVENT.id}&ticketId=${selectedTicket}`}>
                                    <Button className="w-full bg-spotify-green text-black font-bold rounded-full py-6 text-lg hover:scale-105 transition" disabled={!selectedTicket}>
                                        Buy Tickets
                                    </Button>
                                </Link>
                                <p className="text-xs text-center text-zinc-500 mt-4">
                                    Powered by Stripe. Secure payment.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
