"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase"
import { isSupabaseConfigured } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function SignupPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()

        // Check if Supabase is configured
        if (!isSupabaseConfigured()) {
            toast.error("Supabase is not configured. Please add your credentials to .env.local")
            return
        }

        setLoading(true)

        try {
            const supabase = createClient()

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name,
                    },
                },
            })

            if (error) {
                if (error.message.includes('fetch')) {
                    toast.error("Network error. Please check your connection and try again.", {
                        action: {
                            label: "Retry",
                            onClick: () => handleSignup(e)
                        }
                    })
                } else {
                    toast.error(error.message)
                }
                setLoading(false)
                return
            }

            // Create profile if signup successful
            if (data.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: data.user.id,
                        name: name,
                        role: 'user',
                        interests: []
                    })

                if (profileError) {
                    console.error('Profile creation error:', profileError)
                    // Don't block signup if profile creation fails
                }

                toast.success("Account created successfully!")
                router.push("/dashboard")
                router.refresh()
            }
        } catch (error: any) {
            console.error('Signup error:', error)
            toast.error("Unable to reach server. Please check your connection.", {
                action: {
                    label: "Retry",
                    onClick: () => handleSignup(e)
                }
            })
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        if (!isSupabaseConfigured()) {
            toast.error("Supabase is not configured. Please add your credentials to .env.local")
            return
        }

        setLoading(true)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${location.origin}/auth/callback`,
                },
            })

            if (error) {
                toast.error(error.message)
                setLoading(false)
            }
        } catch (error) {
            toast.error("Unable to connect to Google. Please try again.")
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-spotify-black p-4">
            <Card className="w-full max-w-md bg-spotify-dark border-zinc-800 text-white">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <Image src="/logo-text.png" alt="Outsyde" width={150} height={40} className="w-auto h-10" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Sign up for Outsyde</CardTitle>
                    <CardDescription className="text-center text-zinc-400">
                        Create an account to start buying tickets
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Button
                            variant="outline"
                            className="w-full bg-white text-black hover:bg-zinc-200 border-none font-bold rounded-full"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Sign up with Google
                        </Button>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-700" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-spotify-dark px-2 text-zinc-400">Or</span>
                        </div>
                    </div>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:ring-spotify-green focus:border-spotify-green"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:ring-spotify-green focus:border-spotify-green"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Min. 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:ring-spotify-green focus:border-spotify-green"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-spotify-green hover:bg-green-500 text-black font-bold rounded-full"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-zinc-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-white hover:underline font-bold">
                            Log in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
