"use client"

import { useEffect, useState } from "react"

interface GreetingProps {
    name?: string
}

export function Greeting({ name }: GreetingProps) {
    const [greeting, setGreeting] = useState("")
    const [tagline, setTagline] = useState("")

    useEffect(() => {
        const hour = new Date().getHours()

        if (hour < 12) {
            setGreeting("Good morning")
            setTagline("Ready to start your day?")
        } else if (hour < 18) {
            setGreeting("Good afternoon")
            setTagline("Bored at home? Find something to do!")
        } else {
            setGreeting("Good evening")
            setTagline("Time to unwind and have fun.")
        }
    }, [])

    return (
        <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
                {greeting}{name ? `, ${name}` : ''}
            </h1>
            <p className="text-zinc-400 mt-2 text-lg">{tagline}</p>
        </div>
    )
}
