# 🚀 Quick Start Guide - Outsyde Event Ticketing App

## 📋 Required Environment Variables

Create a file named `.env.local` in the project root with these variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### How to Get Supabase Keys:

1. **Create Supabase Project**
   - Visit https://supabase.com
   - Click "New Project"
   - Fill in details and create

2. **Get API Keys**
   - In Supabase Dashboard: **Settings** → **API**
   - Copy these values:
     - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
     - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

3. **Restart Server**
   ```bash
   # Stop server (Ctrl+C) then:
   npm run dev
   ```

---

## 👤 Admin Account Setup

**Login Credentials:**
- **Email:** `admin@outsyde.local`
- **Password:** `admin`

### Setup Steps:

1. **Run Database Schema**
   - Supabase Dashboard → **SQL Editor**
   - Copy/paste contents of `schema.sql`
   - Click **Run**

2. **Run Migrations**
   - Run `supabase/migrations/001_add_interests.sql`
   - Run `supabase/migrations/002_add_upsert_function.sql`

3. **Create Admin User**
   - **Authentication** → **Users** → **Add User**
   - Email: `admin@outsyde.local`
   - Password: `admin`
   - Click **Create user**
   - **Copy the user ID** (UUID)

4. **Run Seed Script**
   - Open `supabase/seed.sql`
   - Replace ALL instances of `YOUR_ADMIN_USER_ID` with the actual UUID
   - Run in SQL Editor

5. **Login**
   - Go to http://localhost:3000/login
   - Email: `admin@outsyde.local`
   - Password: `admin`

---

## ✅ What's Working

### ✅ Authentication
- Signup with email/password
- Login with redirect to dashboard/admin
- Google OAuth ready
- Toast notifications for errors
- Retry mechanism for network failures

### ✅ Mobile Responsive (Spotify-Style)
- Bottom navigation bar (Home, Discover, Interests, Tickets, More)
- Mobile menu overlay
- Touch-friendly buttons (44px minimum)
- Responsive grids and layouts
- Optimized for 360px, 768px, 1366px

### ✅ User Dashboard
- Real data from Supabase
- Stat cards (Wallet, Tickets, Saved Events, Settings)
- My Tickets section
- All buttons functional

### ✅ Admin Panel
- Role-based access (admin only)
- Event CRUD (Create, Read, Update, Delete)
- Publish/Unpublish toggle
- Real-time stats
- User management links

### ✅ Homepage
- Mobile-responsive hero section
- Category browsing with emojis
- Featured events grid
- Upcoming events section
- CTA for event creation
- Real data loading from Supabase

### ✅ Navigation
- Desktop sidebar with active states
- Mobile bottom nav (Spotify-style)
- Mobile menu overlay
- Logout functionality
- Role-based admin link

### ✅ Interests Feature
- Automatic interest tracking
- Personalized recommendations
- Manual interest editing
- "For You" feed

---

## 🔧 Troubleshooting

**"Failed to fetch" error:**
- Verify `.env.local` exists with correct values
- Restart dev server
- Check Supabase project is active

**Can't login:**
- Ensure user created in Supabase Auth
- Verify profile has `role = 'admin'`
- Clear browser cache

**No events showing:**
- Run seed script with correct user ID
- Check events have `published = true`
- Verify in Supabase table editor

**Hydration errors:**
- Clear `.next` folder: `rm -rf .next`
- Restart dev server

---

## 📱 Mobile Testing

Test on these viewports:
- **Mobile:** 360px × 800px
- **Tablet:** 768px × 1024px
- **Desktop:** 1366px × 768px

All layouts are optimized for touch and responsive design.

---

## 🎯 Next Steps

1. ✅ Set up Supabase (done above)
2. ✅ Create admin account (done above)
3. ✅ Run seed script (done above)
4. Test the app:
   - Signup as regular user
   - Login as admin
   - Browse events
   - Test mobile responsiveness
5. Customize:
   - Add your own events
   - Upload custom images
   - Configure Stripe for payments

---

## 📞 Support

Check these files for more details:
- `SETUP.md` - Detailed setup instructions
- `README.md` - Full documentation
- `walkthrough.md` - Feature walkthrough

**Admin Login:**
- Email: `admin@outsyde.local`
- Password: `admin`

Happy event hosting! 🎉
