# Outsyde Event Ticketing App - Setup Guide

## Prerequisites
- Node.js 18+ installed
- Supabase account
- Stripe account (for payments)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Database Setup

1. **Run the base schema** (`schema.sql`):
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `schema.sql`
   - Click "Run"

2. **Run the interests migration** (`supabase/migrations/001_add_interests.sql`):
   - In the SQL Editor, run the migration file
   - This adds interests tracking and user actions tables

3. **Create the admin user**:
   - Go to Authentication > Users in Supabase Dashboard
   - Click "Add User" > "Create new user"
   - Email: `admin@outsyde.local`
   - Password: `OutsydeAdmin!2025`
   - Click "Create user"
   - Copy the user ID (UUID)

4. **Seed the database**:
   - Open `supabase/seed.sql`
   - Replace `'YOUR_ADMIN_USER_ID'` with the actual admin user ID
   - Run the seed script in SQL Editor
   - This creates the admin profile and sample events

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at `http://localhost:3000`

## Admin Login

Use these credentials to access the admin panel:
- **Email**: `admin@outsyde.local`
- **Password**: `OutsydeAdmin!2025`

After logging in, you'll be redirected to `/admin`

## Features

### Authentication
- ✅ Email/Password signup and login
- ✅ Google OAuth
- ✅ Error handling with retry mechanism
- ✅ Toast notifications
- ✅ Automatic profile creation

### Interests Feature
- ✅ Automatic interest tracking based on user actions
- ✅ Personalized "For You" feed
- ✅ Manual interest editing
- ✅ Interest-based event recommendations

### Event Management
- ✅ Create events with banner upload
- ✅ Ticket tier management
- ✅ Real-time event publishing
- ✅ Pending approval for non-admin users

### Admin Panel
- ✅ Event CRUD operations
- ✅ User management
- ✅ Analytics dashboard
- ✅ Pending events approval

### Responsive Design
- ✅ Mobile-first (360px+)
- ✅ Touch-friendly buttons (44px min)
- ✅ Hamburger menu for mobile
- ✅ Tested on multiple viewports

## Testing

### Manual QA Steps

1. **Signup Flow**:
   - Go to `/signup`
   - Create account with email/password
   - Verify profile is created in Supabase
   - Check that interests default to empty array

2. **Login Flow**:
   - Go to `/login`
   - Login with test account
   - Verify redirect to `/dashboard`
   - Login as admin (`admin@outsyde.local`)
   - Verify redirect to `/admin`

3. **Create Event (Admin)**:
   - Login as admin
   - Navigate to Create Event
   - Fill form and upload banner
   - Click Publish
   - Verify event appears in public feed within 3 seconds

4. **Interests Tracking**:
   - View an event (click on event card)
   - Check `user_actions` table for new entry
   - RSVP to an event
   - Verify interest weights updated
   - Check "For You" feed shows relevant events

5. **Responsive Design**:
   - Test on mobile (360x800)
   - Test on tablet (768x1024)
   - Test on desktop (1366x768)
   - Verify all buttons are touch-friendly
   - Verify sidebar becomes hamburger on mobile

6. **Error Handling**:
   - Disconnect network
   - Try to signup/login
   - Verify friendly error message with Retry button
   - Reconnect and click Retry
   - Verify success

## Troubleshooting

### "Failed to fetch" error
- Check that Supabase credentials are correct in `.env.local`
- Verify Supabase project is active
- Check browser console for CORS errors

### Admin login not working
- Verify admin user was created in Supabase Auth
- Check that profile has `role = 'admin'`
- Clear browser cache and try again

### Events not appearing
- Check that `published = true` and `status = 'published'`
- Verify RLS policies allow public read access
- Check browser console for errors

## Next Steps

1. Configure Stripe for real payments
2. Set up Supabase Storage for banner uploads
3. Configure email templates for auth
4. Set up production environment variables
5. Deploy to Vercel

## Support

For issues or questions, check the implementation plan and task list in the artifacts directory.
