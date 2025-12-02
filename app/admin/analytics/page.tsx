"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, DollarSign, Users, Calendar } from "lucide-react"
import Link from "next/link"
import { useCurrency } from "@/components/providers/currency-provider"

export default function AdminAnalyticsPage() {
    const { formatPrice } = useCurrency()
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        users: 0,
        events: 0
    })

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        const supabase = createClient()

        const { data: orders } = await supabase.from('orders').select('total_amount')
        const { count: users } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
        const { count: events } = await supabase.from('events').select('*', { count: 'exact', head: true })

        const revenue = orders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0

        setStats({
            revenue,
            orders: orders?.length || 0,
            users: users || 0,
            events: events || 0
        })
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-8">
            <div className="flex items-center gap-4">
                <Link href="/admin">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Analytics Overview</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-spotify-dark border-zinc-800 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-200">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-spotify-green" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatPrice(stats.revenue)}</div>
                        <div className="text-xs text-green-500 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +20.1% from last month
                        </div>
                    </CardContent>
                </Card>
                {/* Add more cards similar to dashboard but maybe with more detail */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-spotify-dark border-zinc-800 text-white">
                    <CardHeader>
                        <CardTitle>Revenue Trend (Mock)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] flex items-end justify-between gap-2">
                            {[40, 60, 45, 70, 85, 65, 90].map((h, i) => (
                                <div key={i} className="w-full bg-spotify-green/20 hover:bg-spotify-green/40 transition rounded-t-sm relative group">
                                    <div
                                        className="absolute bottom-0 left-0 right-0 bg-spotify-green rounded-t-sm transition-all duration-500"
                                        style={{ height: `${h}%` }}
                                    ></div>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                                        {h}%
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-zinc-400">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-spotify-dark border-zinc-800 text-white">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4 border-b border-zinc-800 pb-4 last:border-0">
                                    <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
                                        <Users className="h-5 w-5 text-zinc-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">New user registered</p>
                                        <p className="text-xs text-zinc-400">2 minutes ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
