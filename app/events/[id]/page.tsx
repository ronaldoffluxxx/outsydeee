import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, Share2, Heart, ArrowLeft, Navigation, Loader2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { useCurrency } from "@/components/providers/currency-provider"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase"
import { useParams } from "next/navigation"

export default function EventDetailsPage() {
    const params = useParams()
    const id = params?.id as string
    const [event, setEvent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
    const { formatPrice } = useCurrency()

    useEffect(() => {
        if (id) {
            loadEvent()
        }
    }, [id])

    const loadEvent = async () => {
        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('events')
                .select('*, profiles(full_name)')
                .eq('id', id)
                .single()

            if (error) throw error
            setEvent(data)
        } catch (error) {
            console.error('Error loading event:', error)
            toast.error("Failed to load event details")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-spotify-green" />
            </div>
        )
    }

    if (!event) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-white mb-4">Event not found</h2>
                <Link href="/events">
                    <Button variant="outline">Back to Events</Button>
                </Link>
            </div>
        )
    }

    // Mock ticket types for now since we don't have a tickets table yet
    // In a real app, these would be fetched from a 'tickets' table related to the event
    const ticketTypes = [
        { id: "t1", name: "General Admission", price: event.price, description: "Standard entry ticket" },
        { id: "t2", name: "VIP", price: event.price * 2, description: "VIP access and perks" },
    ]

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue)}`

    return (
        <div className="max-w-5xl mx-auto pb-20 px-4">
            <Link href="/events" className="inline-flex items-center text-zinc-400 hover:text-white mb-6 transition">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800">
                        <Image
                            src={event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'}
                            alt={event.title}
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
                                            title: event.title,
                                            text: event.description,
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
                                }}
                            >
                                <Heart className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{event.title}</h1>
                        <p className="text-zinc-400 text-lg">by <span className="text-spotify-green font-bold">{event.profiles?.full_name || 'Organizer'}</span></p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-spotify-dark border-none text-white">
                            <CardContent className="p-4 flex items-center">
                                <Calendar className="h-8 w-8 text-spotify-green mr-4" />
                                <div>
                                    <p className="text-xs text-zinc-400 uppercase font-bold">Date</p>
                                    <p className="font-bold">{new Date(event.date).toLocaleDateString()}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-spotify-dark border-none text-white">
                            <CardContent className="p-4 flex items-center">
                                <Clock className="h-8 w-8 text-blue-500 mr-4" />
                                <div>
                                    <p className="text-xs text-zinc-400 uppercase font-bold">Time</p>
                                    <p className="font-bold">{event.time}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-spotify-dark border-none text-white">
                            <CardContent className="p-4 flex items-center">
                                <MapPin className="h-8 w-8 text-red-500 mr-4" />
                                <div>
                                    <p className="text-xs text-zinc-400 uppercase font-bold">Venue</p>
                                    <p className="font-bold truncate">{event.venue}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">About Event</h2>
                        <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{event.description}</p>
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
                            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/90 text-center p-6">
                                <div>
                                    <MapPin className="h-12 w-12 text-spotify-green mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">{event.venue}</h3>
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
                                {ticketTypes.map((ticket) => (
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
                                        {selectedTicket ? formatPrice(ticketTypes.find(t => t.id === selectedTicket)?.price || 0) : formatPrice(0)}
                                    </span>
                                </div>
                                <Link href={`/checkout?eventId=${event.id}&ticketId=${selectedTicket}`}>
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
