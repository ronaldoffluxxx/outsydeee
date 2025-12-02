"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ArrowLeft, Loader2, Upload } from "lucide-react"
import Link from "next/link"

export default function CreateEventPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        time: "",
        venue: "",
        price: "",
        description: "",
        category: "Music",
        image: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, category: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const supabase = createClient()

            // Get current user
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                toast.error("You must be logged in")
                router.push('/login')
                return
            }

            // Create event
            const { error } = await supabase
                .from('events')
                .insert({
                    title: formData.title,
                    date: formData.date,
                    time: formData.time,
                    venue: formData.venue,
                    price: parseFloat(formData.price),
                    description: formData.description,
                    category: formData.category,
                    image: formData.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30', // Default image
                    published: true, // Auto publish as requested
                    organizer_id: user.id
                })

            if (error) throw error

            toast.success("Event created and published successfully!")
            router.push('/admin')
        } catch (error: any) {
            console.error('Error creating event:', error)
            toast.error(error.message || "Failed to create event")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold text-white">Create New Event</h1>
            </div>

            <Card className="bg-spotify-dark border-zinc-800 text-white">
                <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Event Title</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="e.g. Summer Music Festival"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="bg-zinc-900 border-zinc-700 focus:border-spotify-green"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="bg-zinc-900 border-zinc-700 focus:border-spotify-green"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Time</Label>
                                <Input
                                    id="time"
                                    name="time"
                                    type="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                    className="bg-zinc-900 border-zinc-700 focus:border-spotify-green"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="venue">Venue</Label>
                            <Input
                                id="venue"
                                name="venue"
                                placeholder="e.g. Eko Hotel & Suites"
                                value={formData.venue}
                                onChange={handleChange}
                                required
                                className="bg-zinc-900 border-zinc-700 focus:border-spotify-green"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (₦)</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    className="bg-zinc-900 border-zinc-700 focus:border-spotify-green"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select onValueChange={handleSelectChange} defaultValue={formData.category}>
                                    <SelectTrigger className="bg-zinc-900 border-zinc-700">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                                        <SelectItem value="Music">Music</SelectItem>
                                        <SelectItem value="Tech">Tech</SelectItem>
                                        <SelectItem value="Arts">Arts</SelectItem>
                                        <SelectItem value="Business">Business</SelectItem>
                                        <SelectItem value="Food">Food</SelectItem>
                                        <SelectItem value="Sports">Sports</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Image URL</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="image"
                                    name="image"
                                    placeholder="https://..."
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="bg-zinc-900 border-zinc-700 focus:border-spotify-green"
                                />
                            </div>
                            <p className="text-xs text-zinc-400">Leave empty for default image</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Tell people what your event is about..."
                                value={formData.description}
                                onChange={handleChange}
                                required
                                className="bg-zinc-900 border-zinc-700 focus:border-spotify-green min-h-[150px]"
                            />
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full bg-spotify-green hover:bg-green-500 text-black font-bold rounded-full h-12 text-lg"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Event...
                                    </>
                                ) : (
                                    'Create & Publish Event'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
