"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { EventCard } from "@/components/event-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"

const CATEGORIES = ["All", "Music", "Tech", "Comedy", "Sports", "Arts", "Food"]

export default function DiscoverPage() {
    const [events, setEvents] = useState<any[]>([])
    const [filteredEvents, setFilteredEvents] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadEvents()
    }, [])

    useEffect(() => {
        filterEvents()
    }, [searchQuery, selectedCategory, events])

    const loadEvents = async () => {
        const supabase = createClient()

        const { data } = await supabase
            .from('events')
            .select('*')
            .eq('published', true)
            .order('date', { ascending: true })

        if (data && data.length > 0) {
            setEvents(data)
            setFilteredEvents(data)
        } else {
            // Fallback mock data
            const mockEvents = [
                {
                    id: "1",
                    title: "Neon Nights Festival",
                    date: "2025-08-15",
                    venue: "Downtown Arena",
                    price: 150,
                    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1000&auto=format&fit=crop",
                    category: "Music"
                },
                {
                    id: "2",
                    title: "Tech Summit 2025",
                    date: "2025-09-10",
                    venue: "Convention Center",
                    price: 299,
                    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1000&auto=format&fit=crop",
                    category: "Tech"
                },
                {
                    id: "3",
                    title: "Comedy Gold Night",
                    date: "2025-07-20",
                    venue: "The Laugh Factory",
                    price: 45,
                    image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=1000&auto=format&fit=crop",
                    category: "Comedy"
                },
                {
                    id: "4",
                    title: "Jazz in the Park",
                    date: "2025-08-05",
                    venue: "Central Park",
                    price: 0,
                    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000&auto=format&fit=crop",
                    category: "Music"
                },
            ]
            setEvents(mockEvents)
            setFilteredEvents(mockEvents)
        }

        setLoading(false)
    }

    const filterEvents = () => {
        let filtered = events

        // Filter by category
        if (selectedCategory !== "All") {
            filtered = filtered.filter(event =>
                event.category?.toLowerCase() === selectedCategory.toLowerCase()
            )
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(event =>
                event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        setFilteredEvents(filtered)
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Discover Events</h1>
                <p className="text-zinc-400">Find your next amazing experience</p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                    <Input
                        type="text"
                        placeholder="Search events, venues, or categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/10 border-zinc-700 text-white placeholder-zinc-400 focus:ring-spotify-green focus:border-spotify-green h-12"
                    />
                </div>
                <Button variant="outline" className="border-zinc-700 text-white hover:bg-white/10 h-12 px-6">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                </Button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${selectedCategory === category
                                ? "bg-spotify-green text-black"
                                : "bg-white/10 text-white hover:bg-white/20"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Results Count */}
            <div className="text-zinc-400 text-sm">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
            </div>

            {/* Events Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-80 bg-zinc-800 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="text-center py-20">
                    <Search className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
                    <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
                    <p className="text-zinc-400 mb-6">
                        Try adjusting your search or filters
                    </p>
                    <Button
                        onClick={() => {
                            setSearchQuery("")
                            setSelectedCategory("All")
                        }}
                        className="bg-spotify-green hover:bg-green-500 text-black font-bold rounded-full"
                    >
                        Clear Filters
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredEvents.map((event) => (
                        <EventCard key={event.id} {...event} />
                    ))}
                </div>
            )}
        </div>
    )
}
