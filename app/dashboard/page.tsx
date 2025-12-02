"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { TicketCard } from "@/components/ticket-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Ticket, Heart, Settings, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Greeting } from "@/components/dashboard/greeting"
import { useCurrency } from "@/components/providers/currency-provider"

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null)
    const [tickets, setTickets] = useState<any[]>([])
    const [savedEvents, setSavedEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { formatPrice } = useCurrency()

    useEffect(() => {
        const supabase = createClient()

        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) {
                router.push('/login')
                return
            }

            setUser(user)
            loadDashboardData(user.id)
        })
    }, [router])

    const loadDashboardData = async (userId: string) => {
        const supabase = createClient()

        // Load user's tickets/orders
        const { data: orders } = await supabase
            .from('orders')
            .select(`
                *,
                events (
                    id,
                    title,
                    date,
                    time,
                    venue,
                    image
                ),
                tickets (
                    type,
                    price
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (orders) {
            setTickets(orders)
        }

        // Load saved/favorited events
        const { data: favorites } = await supabase
            .from('favorites')
            .select(`
                *,
                events (*)
            `)
            .eq('user_id', userId)

        if (favorites) {
            setSavedEvents(favorites.map(f => f.events))
        }

        setLoading(false)
    }

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-8 bg-zinc-800 rounded w-1/4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-zinc-800 rounded"></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <Greeting name={user?.user_metadata?.full_name?.split(' ')[0] || 'User'} />
                <Link href="/discover">
                    <Button className="bg-spotify-green hover:bg-green-500 text-black font-bold rounded-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Find Events
                    </Button>
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-green-900 to-spotify-dark border-none text-white hover:scale-105 transition-transform cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-200">Wallet Balance</CardTitle>
                        <Wallet className="h-4 w-4 text-spotify-green" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatPrice(0)}</div>
                        <p className="text-xs text-zinc-400 mt-1">Add funds to buy tickets</p>
                    </CardContent>
                </Card>

                <Link href="/dashboard" className="block">
                    <Card className="bg-spotify-dark border-zinc-800 text-white hover:bg-zinc-800/50 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-200">Total Tickets</CardTitle>
                            <Ticket className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{tickets.length}</div>
                            <p className="text-xs text-zinc-400 mt-1">
                                {tickets.filter(t => new Date(t.events?.date) > new Date()).length} upcoming
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/interests" className="block">
                    <Card className="bg-spotify-dark border-zinc-800 text-white hover:bg-zinc-800/50 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-200">Saved Events</CardTitle>
                            <Heart className="h-4 w-4 text-pink-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{savedEvents.length}</div>
                            <p className="text-xs text-zinc-400 mt-1">Events you like</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/settings" className="block">
                    <Card className="bg-spotify-dark border-zinc-800 text-white hover:bg-zinc-800/50 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-200">Settings</CardTitle>
                            <Settings className="h-4 w-4 text-zinc-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold">Profile</div>
                            <p className="text-xs text-zinc-400 mt-1">Manage account</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* My Tickets */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white">My Tickets</h2>
                    {tickets.length > 0 && (
                        <Link href="/dashboard/tickets">
                            <Button variant="ghost" className="text-spotify-green hover:text-green-400">
                                View All
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                    )}
                </div>

                {tickets.length === 0 ? (
                    <Card className="bg-spotify-dark border-zinc-800 text-white">
                        <CardContent className="p-12 text-center">
                            <Ticket className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
                            <h3 className="text-xl font-bold mb-2">No tickets yet</h3>
                            <p className="text-zinc-400 mb-6">
                                Start exploring events and get your first ticket!
                            </p>
                            <Link href="/discover">
                                <Button className="bg-spotify-green hover:bg-green-500 text-black font-bold rounded-full">
                                    Discover Events
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {tickets.slice(0, 5).map((order) => (
                            <TicketCard
                                key={order.id}
                                id={order.id}
                                eventName={order.events?.title || 'Event'}
                                date={order.events?.date || new Date().toISOString()}
                                venue={order.events?.venue || 'Venue'}
                                seat={order.tickets?.type || 'General Admission'}
                                type={order.tickets?.type || 'Regular'}
                                qrCode={order.id}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Saved Events */}
            {savedEvents.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-white">Saved Events</h2>
                        <Link href="/interests">
                            <Button variant="ghost" className="text-spotify-green hover:text-green-400">
                                View All
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {savedEvents.slice(0, 3).map((event) => (
                            <Link key={event.id} href={`/events/${event.id}`}>
                                <Card className="bg-spotify-dark border-zinc-800 hover:bg-zinc-800/50 transition cursor-pointer">
                                    <CardContent className="p-4">
                                        <h3 className="font-bold text-white mb-2">{event.title}</h3>
                                        <p className="text-sm text-zinc-400">
                                            {new Date(event.date).toLocaleDateString()}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}
