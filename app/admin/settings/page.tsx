"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false)
    const [settings, setSettings] = useState({
        siteName: "Outsyde",
        maintenanceMode: false,
        defaultCurrency: "NGN",
        supportEmail: "support@outsyde.com"
    })

    const handleSave = async () => {
        setLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setLoading(false)
        toast.success("Settings saved successfully")
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-8">
            <div className="flex items-center gap-4">
                <Link href="/admin">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Settings</h1>
            </div>

            <Card className="bg-spotify-dark border-zinc-800 text-white">
                <CardHeader>
                    <CardTitle>Platform Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="siteName">Site Name</Label>
                        <Input
                            id="siteName"
                            value={settings.siteName}
                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            className="bg-zinc-900 border-zinc-700"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="supportEmail">Support Email</Label>
                        <Input
                            id="supportEmail"
                            value={settings.supportEmail}
                            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                            className="bg-zinc-900 border-zinc-700"
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg">
                        <div className="space-y-0.5">
                            <Label className="text-base">Maintenance Mode</Label>
                            <p className="text-sm text-zinc-400">Disable access for all users except admins</p>
                        </div>
                        <Switch
                            checked={settings.maintenanceMode}
                            onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                        />
                    </div>

                    <div className="pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-spotify-green hover:bg-green-500 text-black font-bold rounded-full w-full sm:w-auto"
                        >
                            {loading ? "Saving..." : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
