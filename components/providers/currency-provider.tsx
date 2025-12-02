"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

type Currency = 'NGN' | 'USD' | 'EUR' | 'GBP'

interface CurrencyContextType {
    currency: Currency
    symbol: string
    formatPrice: (price: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const CURRENCY_SYMBOLS: Record<Currency, string> = {
    NGN: '₦',
    USD: '$',
    EUR: '€',
    GBP: '£'
}

const CURRENCY_RATES: Record<Currency, number> = {
    NGN: 1, // Base currency
    USD: 0.001, // Mock rate: 1000 NGN = 1 USD
    EUR: 0.0009,
    GBP: 0.0008
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('NGN')

    useEffect(() => {
        // Detect currency based on IP
        const detectCurrency = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/')
                const data = await response.json()

                if (data.currency && ['USD', 'EUR', 'GBP'].includes(data.currency)) {
                    setCurrency(data.currency as Currency)
                } else {
                    setCurrency('NGN') // Default to Naira for others (including NG)
                }
            } catch (error) {
                console.error('Failed to detect currency:', error)
                setCurrency('NGN') // Fallback to Naira
            }
        }

        detectCurrency()
    }, [])

    const formatPrice = (price: number) => {
        // Assuming input price is always in NGN (base)
        // If we want to support multi-currency input, we'd need more logic.
        // For now, we'll just display the symbol and the raw number if it's NGN,
        // or convert if it's another currency.

        let displayPrice = price
        if (currency !== 'NGN') {
            displayPrice = price * CURRENCY_RATES[currency]
        }

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(displayPrice)
    }

    return (
        <CurrencyContext.Provider value={{ currency, symbol: CURRENCY_SYMBOLS[currency], formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    )
}

export function useCurrency() {
    const context = useContext(CurrencyContext)
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider')
    }
    return context
}
