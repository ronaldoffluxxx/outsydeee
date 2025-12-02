"use client"

import { Search, Bell, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"

export function Header() {
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const supabase = createClient()

        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    // Prevent hydration mismatch by not rendering user-specific content until mounted
    if (!mounted) {
        return (
            <div className="sticky top-0 z-40 w-full bg-spotify-black/95 backdrop-blur-md border-b border-white/5">
                <div className="h-16 md:h-16"></div>
            </div>
        )
    }

    return (
        <div className="sticky top-0 z-40 w-full bg-spotify-black/95 backdrop-blur-md border-b border-white/5">
            {/* Desktop Header */}
            <div className="hidden md:flex h-16 items-center justify-between px-6">
                <div className="flex items-center bg-white/10 rounded-full px-4 py-2 w-[300px] hover:bg-white/20 transition">
                    <Search className="h-5 w-5 text-zinc-400 mr-2" />
                    <input
                        type="text"
                        placeholder="What do you want to attend?"
                        className="bg-transparent border-none focus:outline-none text-sm text-white placeholder-zinc-400 w-full"
                    />
                </div>

                <div className="flex items-center gap-x-4">
                    <button className="text-zinc-400 hover:text-white transition">
                        <Bell className="h-5 w-5" />
                    </button>
                    {user ? (
                        <Link href="/dashboard">
                            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2 rounded-full transition">
                                <User className="h-4 w-4" />
                                <span className="text-sm">Profile</span>
                            </button>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-x-2">
                            <Link href="/signup">
                                <button className="font-bold text-zinc-400 hover:text-white hover:scale-105 transition text-sm">
                                    Sign up
                                </button>
                            </Link>
                            <Link href="/login">
                                <button className="bg-white text-black font-bold px-6 py-2 rounded-full hover:scale-105 transition text-sm">
                                    Log in
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between h-14 px-4">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logo-text.png"
                        alt="Outsyde"
                        width={100}
                        height={30}
                        className="w-auto h-7"
                    />
                </Link>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                        className="text-zinc-400 hover:text-white transition p-2"
                    >
                        <Search className="h-5 w-5" />
                    </button>
                    {user ? (
                        <Link href="/dashboard">
                            <button className="text-zinc-400 hover:text-white transition p-2">
                                <User className="h-5 w-5" />
                            </button>
                        </Link>
                    ) : (
                        <Link href="/login">
                            <button className="text-zinc-400 hover:text-white transition p-2">
                                <User className="h-5 w-5" />
                            </button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Search Bar (expandable) */}
            {mobileSearchOpen && (
                <div className="md:hidden px-4 pb-3">
                    <div className="flex items-center bg-white/10 rounded-full px-4 py-2 hover:bg-white/20 transition">
                        <Search className="h-4 w-4 text-zinc-400 mr-2 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="bg-transparent border-none focus:outline-none text-sm text-white placeholder-zinc-400 w-full"
                            autoFocus
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
