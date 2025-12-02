# Supabase Environment Variables Setup Guide

## Required Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## How to Get These Values

1. **Create a Supabase Project**
   - Go to https://supabase.com
   - Click "New Project"
   - Fill in project details and create

2. **Get Your API Keys**
   - In your Supabase dashboard, go to **Settings** → **API**
   - Copy these values:
     - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
     - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

3. **Create `.env.local` File**
   ```bash
   # In your project root
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Restart Dev Server**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

## Admin Account Setup

**Username:** `admin`  
**Password:** `admin`

### Steps to Create Admin:

1. **Run Database Schema**
   - Go to Supabase Dashboard → SQL Editor
   - Run the `schema.sql` file

2. **Create Admin User**
   - Go to Authentication → Users
   - Click "Add User"
   - Email: `admin@outsyde.local`
   - Password: `admin`
   - Click "Create user"

3. **Set Admin Role**
   - Copy the user ID from the users table
   - In SQL Editor, run:
   ```sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE id = 'paste-user-id-here';
   ```

4. **Login**
   - Go to `/login`
   - Email: `admin@outsyde.local`
   - Password: `admin`

## Troubleshooting

**"Failed to fetch" error:**
- Check that `.env.local` exists and has correct values
- Restart dev server after adding env vars
- Verify Supabase project is active

**Can't login:**
- Make sure you created the user in Supabase Auth
- Check that the profile has `role = 'admin'`
- Clear browser cache and try again
