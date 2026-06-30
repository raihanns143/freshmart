# FreshMart Vercel Deployment Guide

To deploy your FreshMart application to production on Vercel, please follow these simple steps.

## Step 1: Install Vercel CLI

I have created a `deploy.ps1` script that automates this. You can run it by opening your terminal and typing:

```powershell
.\deploy.ps1
```

If you prefer to run the commands manually, follow the steps below.

## Step 2: Login to Vercel

Run the following command in your terminal:
```bash
npx vercel login
```
This will open a browser window for you to authenticate with your GitHub, GitLab, or email account.

## Step 3: Link and Deploy

Run the deployment command:
```bash
npx vercel --prod
```

It will ask you a few setup questions:
- **Set up and deploy?**: `Y`
- **Which scope?**: (Select your account)
- **Link to existing project?**: `N`
- **What's your project's name?**: `freshmart-pro`
- **In which directory is your code located?**: `./`
- **Want to override the settings?**: `N`

## Step 4: Configure Environment Variables

Vercel needs your production database URL and authentication secrets to work. 
Once the deployment finishes (it might error out the first time due to missing variables, which is normal), go to your Vercel Dashboard:

1. Go to **Settings** > **Environment Variables**.
2. Add the following keys (copy them from your local `.env` file, but use production values where necessary):
   - `DATABASE_URL` (Your production PostgreSQL connection string, e.g., Supabase or Neon).
   - `NEXTAUTH_SECRET` (A strong random string. You can generate one with `openssl rand -base64 32`).
   - `NEXTAUTH_URL` (Your Vercel deployment URL, e.g., `https://freshmart-pro.vercel.app`).
   - `GOOGLE_CLIENT_ID` (From your Google Cloud Console).
   - `GOOGLE_CLIENT_SECRET` (From your Google Cloud Console).

## Step 5: Final Production Build

After adding the environment variables, trigger a final rebuild to ensure all static pages generate correctly:

```bash
npx vercel --prod
```

Your enterprise e-commerce platform is now live! 🎉
