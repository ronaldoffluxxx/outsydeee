"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Home, Search, Calendar, Heart, User, Settings, LogOut, LayoutDashboard, Sparkles, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const publicRoutes = [
    {
        label: "Home",
        icon: Home,
        href: "/",
        color: "text-sky-500",
    },
    {
        label: "Discover",
        icon: Search,
        href: "/discover",
        color: "text-violet-500",
    },
]

const userRoutes = [
    {
        label: "My Tickets",
        icon: Calendar,
        href: "/dashboard",
        color: "text-pink-700",
    },
    {
        label: "Interests",
        icon: Sparkles,
        href: "/interests",
        color: "text-yellow-500",
    },
]

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const supabase = createClient()

        // Get current user
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)

            if (user) {
                // Check if user is admin
                supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()
                    .then(({ data }) => {
                        setIsAdmin(data?.role === 'admin')
                        setLoading(false)
                    })
            } else {
                setLoading(false)
            }
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            if (!session?.user) {
                setIsAdmin(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleLogout = async () => {
        const supabase = createClient()
        const { error } = await supabase.auth.signOut()

        if (error) {
            toast.error("Failed to log out")
        } else {
            toast.success("Logged out successfully")
            setMobileMenuOpen(false)
            router.push("/")
            router.refresh()
        }
    }

    const closeMobileMenu = () => {
        setMobileMenuOpen(false)
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:flex space-y-4 py-4 flex-col h-full bg-spotify-black text-white w-[250px] fixed left-0 top-0 bottom-0 border-r border-spotify-dark z-50">
                <div className="px-3 py-2 flex-1">
                    <Link href="/" className="flex items-center pl-3 mb-14">
                        <Image
                            src="/logo-full.png"
                            alt="Outsyde"
                            width={140}
                            height={40}
                            className="w-auto h-10"
                        />
                    </Link>

                    {/* Public Routes */}
                    <div className="space-y-1">
                        {publicRoutes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                    pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                                )}
                            >
                                <div className="flex items-center flex-1">
                                    <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                    {route.label}
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* User Routes (only if logged in) */}
                    {user && (
                        <>
                            <div className="mt-8 px-3">
                                <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Your Library</h2>
                                <div className="space-y-1">
                                    {userRoutes.map((route) => (
                                        <Link
                                            key={route.href}
                                            href={route.href}
                                            className={cn(
                                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                                            )}
                                        >
                                            <div className="flex items-center flex-1">
                                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                                {route.label}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Admin Link (only for admins) */}
                            {isAdmin && (
                                <div className="mt-4 px-3">
                                    <Link
                                        href="/admin"
                                        className={cn(
                                            "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                            pathname.startsWith('/admin') ? "text-white bg-white/10" : "text-zinc-400"
                                        )}
                                    >
                                        <div className="flex items-center flex-1">
                                            <LayoutDashboard className="h-5 w-5 mr-3 text-orange-500" />
                                            Admin Panel
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Bottom Section */}
                <div className="px-3 py-2">
                    {user ? (
                        <>
                            <Link
                                href="/settings"
                                className={cn(
                                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition mb-2",
                                    pathname === '/settings' ? "text-white bg-white/10" : "text-zinc-400"
                                )}
                            >
                                <div className="flex items-center flex-1">
                                    <Settings className="h-5 w-5 mr-3" />
                                    Settings
                                </div>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition text-zinc-400"
                            >
                                <div className="flex items-center flex-1">
                                    <LogOut className="h-5 w-5 mr-3" />
                                    Log Out
                                </div>
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition text-zinc-400"
                        >
                            <div className="flex items-center flex-1">
                                <User className="h-5 w-5 mr-3" />
                                Log In
                            </div>
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Bottom Navigation (Spotify-style) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-spotify-black border-t border-zinc-800 z-50">
                <div className="flex items-center justify-around h-16 px-2">
                    <Link
                        href="/"
                        className={cn(
                            "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                            pathname === "/" ? "text-white" : "text-zinc-400"
                        )}
                        onClick={closeMobileMenu}
                    >
                        <Home className="h-6 w-6 mb-1" />
                        <span className="text-xs font-medium">Home</span>
                    </Link>

                    <Link
                        href="/discover"
                        className={cn(
                            "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                            pathname === "/discover" ? "text-white" : "text-zinc-400"
                        )}
                        onClick={closeMobileMenu}
                    >
                        <Search className="h-6 w-6 mb-1" />
                        <span className="text-xs font-medium">Discover</span>
                    </Link>

                    {user && (
                        <>
                            <Link
                                href="/interests"
                                className={cn(
                                    "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                                    pathname === "/interests" ? "text-white" : "text-zinc-400"
                                )}
                                onClick={closeMobileMenu}
                            >
                                <Sparkles className="h-6 w-6 mb-1" />
                                <span className="text-xs font-medium">Interests</span>
                            </Link>

                            <Link
                                href="/dashboard"
                                className={cn(
                                    "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                                    pathname === "/dashboard" ? "text-white" : "text-zinc-400"
                                )}
                                onClick={closeMobileMenu}
                            >
                                <Calendar className="h-6 w-6 mb-1" />
                                <span className="text-xs font-medium">Tickets</span>
                            </Link>
                        </>
                    )}

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={cn(
                            "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                            mobileMenuOpen ? "text-white" : "text-zinc-400"
                        )}
                    >
                        <Menu className="h-6 w-6 mb-1" />
                        <span className="text-xs font-medium">More</span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-black/80 z-50" onClick={() => setMobileMenuOpen(false)}>
                    <div
                        className="absolute bottom-0 left-0 right-0 bg-spotify-dark rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Menu</h2>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-zinc-400 hover:text-white transition"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {user && isAdmin && (
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-white/10 transition text-white"
                                    onClick={closeMobileMenu}
                                >
                                    <LayoutDashboard className="h-6 w-6 text-orange-500" />
                                    <span className="font-medium">Admin Panel</span>
                                </Link>
                            )}

                            {user ? (
                                <>
                                    <Link
                                        href="/settings"
                                        className="flex items-center gap-4 p-4 rounded-lg hover:bg-white/10 transition text-white"
                                        onClick={closeMobileMenu}
                                    >
                                        <Settings className="h-6 w-6" />
                                        <span className="font-medium">Settings</span>
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-4 p-4 rounded-lg hover:bg-white/10 transition text-white w-full text-left"
                                    >
                                        <LogOut className="h-6 w-6" />
                                        <span className="font-medium">Log Out</span>
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-white/10 transition text-white"
                                    onClick={closeMobileMenu}
                                >
                                    <User className="h-6 w-6" />
                                    <span className="font-medium">Log In</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
