"use client"

import { CurrencyProvider } from '@/components/providers/currency-provider'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <CurrencyProvider>
            {children}
            <Toaster
                position="top-center"
                richColors
                theme="dark"
                toastOptions={{
                    style: {
                        background: '#1a1a1a',
                        border: '1px solid #333',
                        color: '#fff',
                    },
                }}
            />
        </CurrencyProvider>
    )
}
