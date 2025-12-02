"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Users, Calendar, DollarSign, Plus, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { useCurrency } from "@/components/providers/currency-provider"

export default function AdminPage() {
    const [user, setUser] = useState<any>(null)
    const [events, setEvents] = useState<any[]>([])
    const [stats, setStats] = useState({
        totalRevenue: 0,
        ticketsSold: 0,
        activeEvents: 0,
        totalUsers: 0
    })
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { formatPrice } = useCurrency()

    useEffect(() => {
        const supabase = createClient()

        supabase.auth.getUser().then(async ({ data: { user } }) => {
            if (!user) {
                router.push('/login')
                return
            }

            // Check if user is admin
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile?.role !== 'admin') {
                toast.error("Access denied. Admin only.")
                router.push('/dashboard')
                return
            }

            setUser(user)
            loadAdminData()
        })
    }, [router])

    const loadAdminData = async () => {
        const supabase = createClient()

        // Load events
        const { data: eventsData } = await supabase
            .from('events')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10)

        if (eventsData) {
            setEvents(eventsData)
        }

        // Load stats
        const { count: userCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })

        const { data: orders } = await supabase
            .from('orders')
            .select('total_amount')

        const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
        const ticketsSold = orders?.length || 0

        const { count: activeCount } = await supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .eq('published', true)
            .gte('date', new Date().toISOString().split('T')[0])

        setStats({
            totalRevenue,
            ticketsSold,
            activeEvents: activeCount || 0,
            totalUsers: userCount || 0
        })

        setLoading(false)
    }

    const handleDeleteEvent = async (eventId: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return

        const supabase = createClient()
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', eventId)

        if (error) {
            toast.error('Failed to delete event')
        } else {
            toast.success('Event deleted successfully')
            loadAdminData()
        }
    }

    const handleTogglePublish = async (eventId: string, currentStatus: boolean) => {
        const supabase = createClient()
        const { error } = await supabase
            .from('events')
            .update({ published: !currentStatus, status: !currentStatus ? 'published' : 'draft' })
            .eq('id', eventId)

        if (error) {
            toast.error('Failed to update event')
        } else {
            toast.success(`Event ${!currentStatus ? 'published' : 'unpublished'}`)
            loadAdminData()
        }
    }

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse max-w-7xl mx-auto">
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
        <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
                <Link href="/admin/create-event" className="w-full sm:w-auto">
                    <Button className="bg-spotify-green text-black font-bold rounded-full hover:scale-105 transition w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Event
                    </Button>
                </Link>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-green-900 to-spotify-dark border-none text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-200">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-spotify-green" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
                        <p className="text-xs text-zinc-400 mt-1">All time earnings</p>
                    </CardContent>
                </Card>

                <Card className="bg-spotify-dark border-zinc-800 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-200">Tickets Sold</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.ticketsSold}</div>
                        <p className="text-xs text-zinc-400 mt-1">Total tickets</p>
                    </CardContent>
                </Card>

                <Card className="bg-spotify-dark border-zinc-800 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-200">Active Events</CardTitle>
                        <BarChart className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeEvents}</div>
                        <p className="text-xs text-zinc-400 mt-1">Published events</p>
                    </CardContent>
                </Card>

                <Card className="bg-spotify-dark border-zinc-800 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-200">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <p className="text-xs text-zinc-400 mt-1">Registered users</p>
                    </CardContent>
                </Card>
            </div>

            {/* Event Management Table */}
            <Card className="bg-spotify-dark border-zinc-800 text-white">
                <CardHeader>
                    <CardTitle>Event Management</CardTitle>
                </CardHeader>
                <CardContent>
                    {events.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
                            <h3 className="text-xl font-bold mb-2">No events yet</h3>
                            <p className="text-zinc-400 mb-6">Create your first event to get started</p>
                            <Link href="/admin/create-event">
                                <Button className="bg-spotify-green hover:bg-green-500 text-black font-bold rounded-full">
                                    Create Event
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto -mx-6 px-6 pb-4">
                            <table className="w-full text-sm text-left min-w-[800px]">
                                <thead className="text-xs text-zinc-400 uppercase bg-white/5">
                                    <tr>
                                        <th className="px-4 md:px-6 py-3 rounded-l-lg">Event Name</th>
                                        <th className="px-4 md:px-6 py-3">Date</th>
                                        <th className="px-4 md:px-6 py-3">Status</th>
                                        <th className="px-4 md:px-6 py-3">Price</th>
                                        <th className="px-4 md:px-6 py-3 rounded-r-lg">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map((event) => (
                                        <tr key={event.id} className="border-b border-zinc-800 hover:bg-white/5 transition">
                                            <td className="px-4 md:px-6 py-4 font-medium">{event.title}</td>
                                            <td className="px-4 md:px-6 py-4 text-zinc-400">
                                                {new Date(event.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 md:px-6 py-4">
                                                <button
                                                    onClick={() => handleTogglePublish(event.id, event.published)}
                                                    className={`px-2 py-1 rounded-full text-xs font-bold transition ${event.published
                                                        ? 'bg-green-900 text-green-300 hover:bg-green-800'
                                                        : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                                                        }`}
                                                >
                                                    {event.published ? 'Published' : 'Draft'}
                                                </button>
                                            </td>
                                            <td className="px-4 md:px-6 py-4">{formatPrice(event.price)}</td>
                                            <td className="px-4 md:px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/events/${event.id}`}>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="hover:bg-white/10 rounded-full h-8 w-8"
                                                            title="View"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/admin/events/${event.id}/edit`}>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="hover:bg-white/10 rounded-full h-8 w-8"
                                                            title="Edit"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="hover:bg-red-500/20 text-red-400 rounded-full h-8 w-8"
                                                        onClick={() => handleDeleteEvent(event.id)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/admin/users">
                    <Card className="bg-spotify-dark border-zinc-800 hover:bg-zinc-800/50 transition cursor-pointer">
                        <CardContent className="p-6 flex items-center gap-4">
                            <Users className="h-8 w-8 text-purple-500" />
                            <div>
                                <h3 className="font-bold text-white">Manage Users</h3>
                                <p className="text-sm text-zinc-400">View and manage all users</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/analytics">
                    <Card className="bg-spotify-dark border-zinc-800 hover:bg-zinc-800/50 transition cursor-pointer">
                        <CardContent className="p-6 flex items-center gap-4">
                            <BarChart className="h-8 w-8 text-blue-500" />
                            <div>
                                <h3 className="font-bold text-white">Analytics</h3>
                                <p className="text-sm text-zinc-400">View detailed reports</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/settings">
                    <Card className="bg-spotify-dark border-zinc-800 hover:bg-zinc-800/50 transition cursor-pointer">
                        <CardContent className="p-6 flex items-center gap-4">
                            <Calendar className="h-8 w-8 text-orange-500" />
                            <div>
                                <h3 className="font-bold text-white">Settings</h3>
                                <p className="text-sm text-zinc-400">Configure platform</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
