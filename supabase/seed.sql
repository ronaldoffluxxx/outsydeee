-- Seed Script for Outsyde Event Ticketing App
-- Run this in your Supabase SQL Editor AFTER creating the admin user

-- ADMIN CREDENTIALS:
-- Email: admin@outsyde.local
-- Password: admin

-- INSTRUCTIONS:
-- 1. First, create the admin user in Supabase Dashboard:
--    - Go to Authentication > Users
--    - Click "Add User"
--    - Email: admin@outsyde.local
--    - Password: admin
--    - Click "Create user"
-- 2. Copy the user ID from the users table
-- 3. Replace '47b6ab08-ec24-4f13-8a12-1bf027fe58b9' below with the actual UUID
-- 4. Run this script in SQL Editor

-- Update admin profile (replace 47b6ab08-ec24-4f13-8a12-1bf027fe58b9 with actual ID)
INSERT INTO profiles (id, name, role, interests, created_at)
VALUES (
    '47b6ab08-ec24-4f13-8a12-1bf027fe58b9', -- REPLACE THIS with the actual admin user ID
    'Admin User',
    'admin',
    ARRAY['music', 'sports', 'technology'],
    NOW()
) ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Sample Events
INSERT INTO events (id, title, description, date, time, location, venue, category, image, price, organizer_id, tags, published, status, created_at)
VALUES
    (
        gen_random_uuid(),
        'Neon Nights Festival',
        'Experience the ultimate electronic music festival with world-class DJs and stunning visual effects.',
        '2025-08-15',
        '20:00',
        'New York, NY',
        'Downtown Arena',
        'Music',
        'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1000&auto=format&fit=crop',
        150,
        '47b6ab08-ec24-4f13-8a12-1bf027fe58b9', -- REPLACE THIS
        ARRAY['music', 'electronic', 'festival', 'nightlife'],
        true,
        'published',
        NOW()
    ),
    (
        gen_random_uuid(),
        'Tech Summit 2025',
        'Join industry leaders and innovators for a day of cutting-edge technology discussions and networking.',
        '2025-09-20',
        '09:00',
        'San Francisco, CA',
        'Convention Center',
        'Technology',
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop',
        299,
        '47b6ab08-ec24-4f13-8a12-1bf027fe58b9', -- REPLACE THIS
        ARRAY['technology', 'business', 'networking', 'innovation'],
        true,
        'published',
        NOW()
    ),
    (
        gen_random_uuid(),
        'Summer Jazz Concert',
        'Enjoy an evening of smooth jazz under the stars with renowned artists.',
        '2025-07-10',
        '19:00',
        'Chicago, IL',
        'Millennium Park',
        'Music',
        'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000&auto=format&fit=crop',
        75,
        '47b6ab08-ec24-4f13-8a12-1bf027fe58b9', -- REPLACE THIS
        ARRAY['music', 'jazz', 'outdoor', 'summer'],
        true,
        'published',
        NOW()
    ),
    (
        gen_random_uuid(),
        'Food & Wine Festival',
        'Taste exquisite dishes and wines from top chefs and vineyards around the world.',
        '2025-10-05',
        '12:00',
        'Los Angeles, CA',
        'Grand Park',
        'Food & Drink',
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop',
        125,
        '47b6ab08-ec24-4f13-8a12-1bf027fe58b9', -- REPLACE THIS
        ARRAY['food', 'wine', 'culinary', 'festival'],
        true,
        'published',
        NOW()
    ),
    (
        gen_random_uuid(),
        'Marathon City Run',
        'Challenge yourself in this annual city marathon with routes for all skill levels.',
        '2025-11-15',
        '07:00',
        'Boston, MA',
        'City Center',
        'Sports',
        'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=1000&auto=format&fit=crop',
        50,
        '47b6ab08-ec24-4f13-8a12-1bf027fe58b9', -- REPLACE THIS
        ARRAY['sports', 'fitness', 'running', 'outdoor'],
        true,
        'published',
        NOW()
    ),
    (
        gen_random_uuid(),
        'Art Gallery Opening',
        'Discover contemporary art from emerging artists at this exclusive gallery opening.',
        '2025-08-25',
        '18:00',
        'Miami, FL',
        'Wynwood Arts District',
        'Arts',
        'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1000&auto=format&fit=crop',
        0,
        '47b6ab08-ec24-4f13-8a12-1bf027fe58b9', -- REPLACE THIS
        ARRAY['art', 'culture', 'gallery', 'exhibition'],
        true,
        'published',
        NOW()
    );

-- Verify the data was inserted
SELECT COUNT(*) as event_count FROM events WHERE published = true;
