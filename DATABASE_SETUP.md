# 🚀 Step-by-Step Database Setup Guide

Follow these steps exactly to set up your Supabase database and admin account.

---

## Step 1: Access Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Log in to your account
3. Click on your project: **kpsyhvegtmhecyrpqadr**

---

## Step 2: Run the Schema (Create Tables)

1. In the left sidebar, click **SQL Editor**
2. Click **New Query** button
3. Open the file `schema.sql` from your project folder
4. Copy ALL the contents
5. Paste into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. Wait for "Success. No rows returned" message

**What this does:** Creates all the database tables (events, profiles, orders, tickets, etc.)

---

## Step 3: Run Migration 001 (Add Interests)

1. Still in **SQL Editor**, click **New Query**
2. Open `supabase/migrations/001_add_interests.sql`
3. Copy all contents
4. Paste into SQL Editor
5. Click **Run**
6. Wait for success message

**What this does:** Adds interests tracking tables and columns

---

## Step 4: Run Migration 002 (Add Function)

1. Click **New Query** again
2. Open `supabase/migrations/002_add_upsert_function.sql`
3. Copy all contents
4. Paste into SQL Editor
5. Click **Run**
6. Wait for success message

**What this does:** Creates a function for updating interest weights

---

## Step 5: Create Admin User

1. In the left sidebar, click **Authentication**
2. Click **Users** tab
3. Click **Add User** button (green button, top right)
4. Fill in the form:
   - **Email:** `admin@outsyde.local`
   - **Password:** `admin`
   - **Auto Confirm User:** ✅ Check this box
5. Click **Create User**
6. **IMPORTANT:** Copy the **User ID** (UUID) - it looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

**Save this User ID somewhere - you'll need it in the next step!**

---

## Step 6: Run Seed Script (Add Sample Data)

1. Go back to **SQL Editor**
2. Click **New Query**
3. Open `supabase/seed.sql` from your project
4. Find ALL instances of `YOUR_ADMIN_USER_ID` (there are 7 of them)
5. Replace each one with the User ID you copied in Step 5
6. Click **Run**
7. Wait for success message

**What this does:** 
- Sets the user as admin
- Creates 6 sample events

---

## Step 7: Verify Everything Works

1. In Supabase, click **Table Editor** in the left sidebar
2. Click on **profiles** table
3. You should see one row with:
   - `id`: your user ID
   - `role`: `admin`
   - `name`: `Admin User`

4. Click on **events** table
5. You should see 6 events with `published = true`

---

## Step 8: Test Login

1. Go to your app: http://localhost:3000
2. Click **Log In**
3. Enter:
   - **Email:** `admin@outsyde.local`
   - **Password:** `admin`
4. Click **Log in**
5. You should be redirected to `/admin` (Admin Dashboard)

---

## ✅ Success Checklist

- [ ] Schema.sql ran successfully
- [ ] Migration 001 ran successfully
- [ ] Migration 002 ran successfully
- [ ] Admin user created
- [ ] User ID copied
- [ ] Seed.sql ran with correct User ID
- [ ] Profiles table shows admin role
- [ ] Events table shows 6 events
- [ ] Can login as admin
- [ ] Redirected to admin dashboard

---

## 🆘 Troubleshooting

**"User already exists" error:**
- Go to Authentication > Users
- Delete the existing admin user
- Try Step 5 again

**"Failed to fetch" error when logging in:**
- Make sure you restarted the dev server after creating `.env.local`
- Run: `npm run dev`

**Redirected to dashboard instead of admin:**
- Check profiles table - make sure `role = 'admin'`
- If not, run this in SQL Editor:
  ```sql
  UPDATE profiles 
  SET role = 'admin' 
  WHERE id = 'paste-your-user-id-here';
  ```

**No events showing on homepage:**
- Check events table - make sure `published = true`
- Verify seed.sql ran successfully

---

## 📝 Quick Reference

**Admin Credentials:**
- Email: `admin@outsyde.local`
- Password: `admin`

**Supabase Project:**
- URL: `https://kpsyhvegtmhecyrpqadr.supabase.co`

**Files to Run (in order):**
1. `schema.sql`
2. `supabase/migrations/001_add_interests.sql`
3. `supabase/migrations/002_add_upsert_function.sql`
4. Create user in Auth
5. `supabase/seed.sql` (with User ID replaced)

---

Need help? Check the error message in Supabase SQL Editor and make sure each step completed successfully before moving to the next one!
