-- Add interests field to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}';

-- Create user_actions table for tracking behavior
CREATE TABLE IF NOT EXISTS user_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- 'view', 'rsvp', 'purchase'
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_actions_user_id ON user_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_event_id ON user_actions(event_id);

-- Create interest_weights table for personalization
CREATE TABLE IF NOT EXISTS interest_weights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    weight DECIMAL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, tag)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_interest_weights_user_id ON interest_weights(user_id);

-- Enable RLS on new tables
ALTER TABLE user_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interest_weights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_actions
CREATE POLICY "Users can view their own actions"
    ON user_actions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own actions"
    ON user_actions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all actions"
    ON user_actions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- RLS Policies for interest_weights
CREATE POLICY "Users can view their own interests"
    ON interest_weights FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own interests"
    ON interest_weights FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all interests"
    ON interest_weights FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Update events table to add tags if not exists
ALTER TABLE events ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE events ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;
ALTER TABLE events ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft'; -- 'draft', 'pending', 'published'

-- Add organizer_id to events
ALTER TABLE events ADD COLUMN IF NOT EXISTS organizer_id UUID REFERENCES auth.users(id);
