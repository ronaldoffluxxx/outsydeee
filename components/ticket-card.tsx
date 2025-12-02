"use client"

import { QrCode, Calendar, MapPin, Download } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TicketCardProps {
    id: string
    eventName: string
    date: string
    venue: string
    seat: string
    type: string
    qrCode: string
}

export function TicketCard({ id, eventName, date, venue, seat, type, qrCode }: TicketCardProps) {
    return (
        <Card className="bg-spotify-dark border-none text-white overflow-hidden flex flex-col md:flex-row">
            <div className="flex-1 p-6 space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-bold mb-1">{eventName}</h3>
                        <div className="flex items-center text-zinc-400 text-sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(date).toLocaleDateString(undefined, {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric'
                            })}
                        </div>
                    </div>
                    <div className="bg-spotify-green text-black px-3 py-1 rounded-full text-xs font-bold uppercase">
                        {type}
                    </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center text-zinc-300">
                        <MapPin className="h-4 w-4 mr-2 text-spotify-green" />
                        {venue}
                    </div>
                    <div className="text-zinc-300">
                        <span className="text-zinc-500 mr-2">Seat:</span>
                        <span className="font-bold">{seat}</span>
                    </div>
                </div>

                <div className="pt-4 flex gap-3">
                    <Button variant="outline" className="border-zinc-700 text-white hover:bg-white/10 rounded-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                    </Button>
                    <Button className="bg-white text-black hover:bg-zinc-200 rounded-full font-bold">
                        View Details
                    </Button>
                </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-white p-6 flex flex-col items-center justify-center md:w-[200px] border-l border-dashed border-zinc-300 relative">
                <div className="absolute -left-3 top-0 bottom-0 flex flex-col justify-between py-2">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="w-6 h-6 bg-spotify-dark rounded-full -ml-3"></div>
                    ))}
                </div>
                <QrCode className="h-24 w-24 text-black mb-2" />
                <p className="text-xs text-zinc-500 font-mono text-center break-all">{id.substring(0, 8)}</p>
                <p className="text-[10px] text-zinc-400 mt-2 uppercase tracking-wider">Scan at gate</p>
            </div>
        </Card>
    )
}
