# 🚀 Deployment Guide (Vercel)

Follow these steps to deploy your Outsyde application to Vercel.

## Prerequisites

- A [GitHub](https://github.com) account
- A [Vercel](https://vercel.com) account
- Your Supabase project URL and keys
- Your Paystack Public Key

## Step 1: Push to GitHub

1. Initialize git (if not already done):
   ```bash
   git init
   ```
2. Add all files:
   ```bash
   git add .
   ```
3. Commit changes:
   ```bash
   git commit -m "Ready for deployment"
   ```
4. Create a new repository on GitHub.
5. Link and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/outsyde.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** > **Project**.
3. Import your `outsyde` repository.
4. In the **Configure Project** screen:
   - **Framework Preset**: Next.js (should be auto-detected)
   - **Root Directory**: `./` (default)

## Step 3: Environment Variables

Expand the **Environment Variables** section and add the following:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Your Paystack Public Key |

> **Note:** You can find your Supabase keys in Project Settings > API.

## Step 4: Deploy

1. Click **Deploy**.
2. Wait for the build to complete.
3. Once finished, you'll get a live URL (e.g., `https://outsyde.vercel.app`).

## Step 5: Update Supabase Auth Settings

1. Go to your Supabase Dashboard > Authentication > URL Configuration.
2. Add your new Vercel URL to **Site URL** and **Redirect URLs**.
   - Example: `https://outsyde.vercel.app/**`
3. Save changes.

## ✅ Done!

Your application is now live!
