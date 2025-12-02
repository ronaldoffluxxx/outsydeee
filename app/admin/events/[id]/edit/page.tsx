"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function EditEventPage() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id as string
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
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

    useEffect(() => {
        if (id) {
            loadEvent()
        }
    }, [id])

    const loadEvent = async () => {
        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error

            setFormData({
                title: data.title,
                date: data.date,
                time: data.time,
                venue: data.venue,
                price: data.price.toString(),
                description: data.description,
                category: data.category,
                image: data.image || ""
            })
        } catch (error) {
            console.error('Error loading event:', error)
            toast.error("Failed to load event")
            router.push('/admin')
        } finally {
            setFetching(false)
        }
    }

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

            const { error } = await supabase
                .from('events')
                .update({
                    title: formData.title,
                    date: formData.date,
                    time: formData.time,
                    venue: formData.venue,
                    price: parseFloat(formData.price),
                    description: formData.description,
                    category: formData.category,
                    image: formData.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
                })
                .eq('id', id)

            if (error) throw error

            toast.success("Event updated successfully!")
            router.push('/admin')
        } catch (error: any) {
            console.error('Error updating event:', error)
            toast.error(error.message || "Failed to update event")
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-spotify-green" />
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold text-white">Edit Event</h1>
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
                            <Input
                                id="image"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className="bg-zinc-900 border-zinc-700 focus:border-spotify-green"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
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
                                        Updating Event...
                                    </>
                                ) : (
                                    'Update Event'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
