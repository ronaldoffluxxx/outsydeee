"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

export default function InterestsPage() {
    const [user, setUser] = useState<any>(null)
    const [interests, setInterests] = useState<string[]>([])
    const [recommendedEvents, setRecommendedEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const supabase = createClient()

        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setUser(user)
                loadUserInterests(user.id)
                loadRecommendedEvents(user.id)
            } else {
                setLoading(false)
            }
        })
    }, [])

    const loadUserInterests = async (userId: string) => {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('profiles')
            .select('interests')
            .eq('id', userId)
            .single()

        if (data) {
            setInterests(data.interests || [])
        }
    }

    const loadRecommendedEvents = async (userId: string) => {
        const supabase = createClient()

        // Get user's interest weights
        const { data: weights } = await supabase
            .from('interest_weights')
            .select('tag, weight')
            .eq('user_id', userId)
            .order('weight', { ascending: false })

        if (weights && weights.length > 0) {
            const topTags = weights.slice(0, 5).map(w => w.tag)

            // Get events matching user's interests
            const { data: events } = await supabase
                .from('events')
                .select('*')
                .eq('published', true)
                .overlaps('tags', topTags)
                .limit(12)

            if (events) {
                setRecommendedEvents(events)
            }
        } else {
            // If no interests yet, show popular events
            const { data: events } = await supabase
                .from('events')
                .select('*')
                .eq('published', true)
                .limit(12)

            if (events) {
                setRecommendedEvents(events)
            }
        }

        setLoading(false)
    }

    const removeInterest = async (tag: string) => {
        if (!user) return

        const supabase = createClient()
        const newInterests = interests.filter(i => i !== tag)

        const { error } = await supabase
            .from('profiles')
            .update({ interests: newInterests })
            .eq('id', user.id)

        if (error) {
            toast.error("Failed to update interests")
        } else {
            setInterests(newInterests)
            toast.success("Interest removed")
        }
    }

    if (!user) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card className="bg-spotify-dark border-zinc-800 text-white">
                    <CardContent className="p-12 text-center">
                        <Sparkles className="h-16 w-16 mx-auto mb-4 text-spotify-green" />
                        <h2 className="text-2xl font-bold mb-2">Discover Your Interests</h2>
                        <p className="text-zinc-400 mb-6">
                            Log in to get personalized event recommendations based on your interests
                        </p>
                        <Link href="/login">
                            <Button className="bg-spotify-green hover:bg-green-500 text-black font-bold rounded-full">
                                Log In
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-zinc-800 rounded w-1/4"></div>
                    <div className="h-64 bg-zinc-800 rounded"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                    <Sparkles className="h-8 w-8 text-spotify-green" />
                    Your Interests
                </h1>
                <p className="text-zinc-400">
                    Events personalized just for you based on your activity
                </p>
            </div>

            {/* Current Interests */}
            {interests.length > 0 && (
                <Card className="bg-spotify-dark border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-spotify-green" />
                            Your Top Interests
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {interests.map((interest) => (
                                <Badge
                                    key={interest}
                                    variant="secondary"
                                    className="bg-spotify-green/20 text-spotify-green border-spotify-green/30 px-4 py-2 text-sm flex items-center gap-2"
                                >
                                    {interest}
                                    <button
                                        onClick={() => removeInterest(interest)}
                                        className="hover:text-white transition"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recommended Events */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                    {interests.length > 0 ? "Recommended For You" : "Popular Events"}
                </h2>

                {recommendedEvents.length === 0 ? (
                    <Card className="bg-spotify-dark border-zinc-800 text-white">
                        <CardContent className="p-12 text-center">
                            <p className="text-zinc-400">
                                Start exploring events to build your personalized recommendations
                            </p>
                            <Link href="/">
                                <Button className="mt-4 bg-spotify-green hover:bg-green-500 text-black font-bold rounded-full">
                                    Discover Events
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendedEvents.map((event) => (
                            <Link key={event.id} href={`/events/${event.id}`}>
                                <Card className="bg-spotify-dark border-zinc-800 hover:bg-zinc-800/50 transition cursor-pointer group overflow-hidden">
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={event.image || '/placeholder-event.jpg'}
                                            alt={event.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-bold text-white mb-2 line-clamp-1">
                                            {event.title}
                                        </h3>
                                        <p className="text-sm text-zinc-400 mb-2 line-clamp-2">
                                            {event.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-500">
                                                {new Date(event.date).toLocaleDateString()}
                                            </span>
                                            <span className="text-spotify-green font-bold">
                                                ${event.price}
                                            </span>
                                        </div>
                                        {event.tags && event.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {event.tags.slice(0, 3).map((tag: string) => (
                                                    <Badge
                                                        key={tag}
                                                        variant="outline"
                                                        className="text-xs border-zinc-700 text-zinc-400"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
