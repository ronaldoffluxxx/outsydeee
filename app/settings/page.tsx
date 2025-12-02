"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { ArrowLeft, Loader2, User, Mail, Phone, AtSign } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        phone: "",
        email: ""
    })

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        const supabase = createClient()

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            router.push('/login')
            return
        }

        setUser(user)

        // Load profile data
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (profile) {
            setFormData({
                fullName: profile.full_name || user.user_metadata?.full_name || "",
                username: profile.username || "",
                phone: profile.phone || "",
                email: user.email || ""
            })
        }

        setLoading(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const supabase = createClient()

            // Update profiles table
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: formData.fullName,
                    username: formData.username,
                    phone: formData.phone,
                    updated_at: new Date().toISOString()
                })

            if (profileError) throw profileError

            // Update auth metadata
            const { error: authError } = await supabase.auth.updateUser({
                data: { full_name: formData.fullName }
            })

            if (authError) throw authError

            toast.success("Profile updated successfully")
        } catch (error: any) {
            console.error('Error updating profile:', error)
            toast.error(error.message || "Failed to update profile")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-spotify-green" />
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 p-4 md:p-8">
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold text-white">Settings</h1>
            </div>

            <Card className="bg-spotify-dark border-zinc-800 text-white">
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                <Input
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="pl-10 bg-zinc-900/50 border-zinc-700 text-zinc-400 cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-zinc-500">Email cannot be changed</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="pl-10 bg-zinc-900 border-zinc-700 focus:border-spotify-green"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <div className="relative">
                                <AtSign className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                <Input
                                    id="username"
                                    name="username"
                                    placeholder="johndoe"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="pl-10 bg-zinc-900 border-zinc-700 focus:border-spotify-green"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                <Input
                                    id="phone"
                                    name="phone"
                                    placeholder="+234..."
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="pl-10 bg-zinc-900 border-zinc-700 focus:border-spotify-green"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full bg-spotify-green hover:bg-green-500 text-black font-bold rounded-full h-12"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving Changes...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
