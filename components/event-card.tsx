"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Ticket } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { useCurrency } from "@/components/providers/currency-provider"

interface EventCardProps {
    id: string
    title: string
    date: string
    venue: string
    price: number
    image: string
    category: string
}

export function EventCard({ id, title, date, venue, price, image, category }: EventCardProps) {
    const { formatPrice } = useCurrency()

    return (
        <Link href={`/events/${id}`}>
            <Card className="bg-spotify-dark border-none hover:bg-white/10 transition duration-300 group overflow-hidden h-full flex flex-col">
                <div className="relative aspect-square w-full overflow-hidden rounded-t-lg">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white uppercase">
                        {category}
                    </div>
                </div>
                <CardContent className="p-4 flex-1">
                    <h3 className="text-white font-bold text-lg truncate mb-1">{title}</h3>
                    <div className="flex items-center text-zinc-400 text-sm mb-1">
                        <Calendar className="h-3 w-3 mr-2" />
                        {new Date(date).toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </div>
                    <div className="flex items-center text-zinc-400 text-sm">
                        <MapPin className="h-3 w-3 mr-2" />
                        <span className="truncate">{venue}</span>
                    </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex items-center justify-between mt-auto">
                    <div className="text-white font-bold">
                        {price === 0 ? "Free" : formatPrice(price)}
                    </div>
                    <div className="bg-spotify-green rounded-full p-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300 shadow-lg shadow-black/50">
                        <Ticket className="h-4 w-4 text-black fill-black" />
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}
