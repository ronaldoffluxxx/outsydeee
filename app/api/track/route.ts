import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { userId, eventId, actionType, tags } = await request.json()

        if (!userId || !eventId || !actionType) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const supabase = createClient()

        // Insert user action
        const { error: actionError } = await supabase
            .from('user_actions')
            .insert({
                user_id: userId,
                event_id: eventId,
                action_type: actionType
            })

        if (actionError) {
            console.error('Action tracking error:', actionError)
            return NextResponse.json(
                { error: 'Failed to track action' },
                { status: 500 }
            )
        }

        // Update interest weights based on tags
        if (tags && tags.length > 0) {
            const weightIncrement = actionType === 'purchase' ? 10 : actionType === 'rsvp' ? 5 : 1

            for (const tag of tags) {
                // Upsert interest weight
                const { error: weightError } = await supabase.rpc('upsert_interest_weight', {
                    p_user_id: userId,
                    p_tag: tag,
                    p_increment: weightIncrement
                })

                if (weightError) {
                    console.error('Interest weight error:', weightError)
                    // Continue with other tags even if one fails
                }
            }

            // Update user interests array
            const { data: weights } = await supabase
                .from('interest_weights')
                .select('tag, weight')
                .eq('user_id', userId)
                .order('weight', { ascending: false })
                .limit(10)

            if (weights) {
                const topInterests = weights.map(w => w.tag)

                await supabase
                    .from('profiles')
                    .update({ interests: topInterests })
                    .eq('id', userId)
            }
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Track API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
