export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    name: string | null
                    avatar_url: string | null
                    role: 'user' | 'admin' | 'organizer'
                    created_at: string
                }
                Insert: {
                    id: string
                    email: string
                    name?: string | null
                    avatar_url?: string | null
                    role?: 'user' | 'admin' | 'organizer'
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    name?: string | null
                    avatar_url?: string | null
                    role?: 'user' | 'admin' | 'organizer'
                    created_at?: string
                }
            }
            events: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    category: string
                    banner_url: string | null
                    venue: string
                    date: string
                    time: string
                    created_by: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    category: string
                    banner_url?: string | null
                    venue: string
                    date: string
                    time: string
                    created_by: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    category?: string
                    banner_url?: string | null
                    venue?: string
                    date?: string
                    time?: string
                    created_by?: string
                    created_at?: string
                }
            }
            ticket_types: {
                Row: {
                    id: string
                    event_id: string
                    name: string
                    price: number
                    capacity: number
                    sold: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    event_id: string
                    name: string
                    price: number
                    capacity: number
                    sold?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    event_id?: string
                    name?: string
                    price?: number
                    capacity?: number
                    sold?: number
                    created_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    user_id: string
                    event_id: string
                    total_amount: number
                    payment_status: 'pending' | 'paid' | 'failed'
                    stripe_session_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    event_id: string
                    total_amount: number
                    payment_status?: 'pending' | 'paid' | 'failed'
                    stripe_session_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    event_id?: string
                    total_amount?: number
                    payment_status?: 'pending' | 'paid' | 'failed'
                    stripe_session_id?: string | null
                    created_at?: string
                }
            }
            tickets: {
                Row: {
                    id: string
                    order_id: string
                    event_id: string
                    user_id: string
                    ticket_type_id: string
                    qr_code: string
                    status: 'valid' | 'used' | 'cancelled'
                    created_at: string
                }
                Insert: {
                    id?: string
                    order_id: string
                    event_id: string
                    user_id: string
                    ticket_type_id: string
                    qr_code: string
                    status?: 'valid' | 'used' | 'cancelled'
                    created_at?: string
                }
                Update: {
                    id?: string
                    order_id?: string
                    event_id?: string
                    user_id?: string
                    ticket_type_id?: string
                    qr_code?: string
                    status?: 'valid' | 'used' | 'cancelled'
                    created_at?: string
                }
            }
        }
    }
}
