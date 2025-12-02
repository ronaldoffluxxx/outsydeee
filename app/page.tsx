"use client"

import { useEffect, useState } from "react"
import { EventCard } from "@/components/event-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { Play, TrendingUp } from "lucide-react"

const CATEGORIES = [
  { name: "Music", color: "bg-pink-600", emoji: "🎵" },
  { name: "Tech", color: "bg-blue-600", emoji: "💻" },
  { name: "Comedy", color: "bg-orange-600", emoji: "😂" },
  { name: "Sports", color: "bg-green-600", emoji: "⚽" },
  { name: "Arts", color: "bg-purple-600", emoji: "🎨" },
  { name: "Food", color: "bg-red-600", emoji: "🍕" },
]

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    const supabase = createClient()

    // Load published events
    const { data: events } = await supabase
      .from('events')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(8)

    if (events && events.length > 0) {
      setFeaturedEvents(events.slice(0, 4))
      setUpcomingEvents(events.slice(4, 8))
    } else {
      // Fallback to mock data if no events in database
      const mockEvents = [
        {
          id: "1",
          title: "Neon Nights Festival",
          date: "2024-08-15",
          venue: "Downtown Arena",
          price: 150,
          image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1000&auto=format&fit=crop",
          category: "Music"
        },
        {
          id: "2",
          title: "Tech Summit 2024",
          date: "2024-09-10",
          venue: "Convention Center",
          price: 299,
          image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1000&auto=format&fit=crop",
          category: "Tech"
        },
        {
          id: "3",
          title: "Comedy Gold Night",
          date: "2024-07-20",
          venue: "The Laugh Factory",
          price: 45,
          image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=1000&auto=format&fit=crop",
          category: "Comedy"
        },
        {
          id: "4",
          title: "Jazz in the Park",
          date: "2024-08-05",
          venue: "Central Park",
          price: 0,
          image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000&auto=format&fit=crop",
          category: "Music"
        },
      ]
      setFeaturedEvents(mockEvents)
      setUpcomingEvents(mockEvents.slice().reverse())
    }

    setLoading(false)
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-4 md:pb-20 pt-4 md:pt-0">

      {/* Hero Section - Mobile Optimized */}
      <section className="relative h-[250px] md:h-[350px] rounded-lg md:rounded-xl overflow-hidden bg-gradient-to-b from-indigo-900 to-spotify-black p-6 md:p-8 flex flex-col justify-end">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1459749411177-287ce328810e?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-2xl md:text-5xl font-bold text-white mb-2 md:mb-4 tracking-tight">
            Discover Live Events
          </h1>
          <p className="text-zinc-200 text-sm md:text-lg mb-4 md:mb-6">
            Find tickets for concerts, workshops, sports, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Link href="/discover" className="flex-1 sm:flex-initial">
              <Button className="w-full sm:w-auto bg-spotify-green text-black font-bold rounded-full px-6 md:px-8 h-11 md:h-12 hover:scale-105 transition">
                <Play className="h-4 w-4 mr-2" />
                Explore Now
              </Button>
            </Link>
            <Link href="/login" className="flex-1 sm:flex-initial">
              <Button variant="outline" className="w-full sm:w-auto text-white border-white/20 hover:bg-white/10 rounded-full px-6 md:px-8 h-11 md:h-12">
                Sell Tickets
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories - Mobile Optimized Grid */}
      <section>
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">Browse Categories</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.name} href={`/discover?category=${cat.name}`}>
              <div className={`${cat.color} h-24 md:h-32 rounded-lg p-3 md:p-4 relative overflow-hidden hover:scale-105 transition cursor-pointer active:scale-95`}>
                <div className="flex flex-col h-full justify-between">
                  <span className="text-2xl md:text-3xl">{cat.emoji}</span>
                  <h3 className="text-base md:text-xl font-bold text-white">{cat.name}</h3>
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 md:w-16 md:h-16 bg-black/20 rounded-full rotate-12 transform"></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Events - Mobile Optimized */}
      <section>
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-spotify-green" />
            Featured Events
          </h2>
          <Link href="/discover" className="text-xs md:text-sm font-bold text-zinc-400 hover:text-white uppercase tracking-wider">
            Show All
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-64 bg-zinc-800 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Events - Mobile Optimized */}
      <section>
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">Upcoming Near You</h2>
          <Link href="/discover" className="text-xs md:text-sm font-bold text-zinc-400 hover:text-white uppercase tracking-wider">
            Show All
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-64 bg-zinc-800 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={`upcoming-${event.id}`} {...event} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="bg-gradient-to-r from-spotify-green/20 to-blue-600/20 rounded-lg md:rounded-xl p-6 md:p-8 border border-spotify-green/30">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">
            Host Your Own Event
          </h2>
          <p className="text-zinc-300 text-sm md:text-base mb-4 md:mb-6">
            Create and manage events, sell tickets, and grow your audience with Outsyde.
          </p>
          <Link href="/login">
            <Button className="w-full sm:w-auto bg-spotify-green hover:bg-green-500 text-black font-bold rounded-full px-6 md:px-8 h-11 md:h-12">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

    </div>
  )
}
