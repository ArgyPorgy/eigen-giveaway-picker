# Fix Google OAuth Redirect URI Mismatch

Google OAuth is enabled in Privy but not showing because of redirect URI mismatch. Here's how to fix it:

## Step 1: Configure Redirect URIs in Privy Dashboard

1. Go to https://dashboard.privy.io
2. Select your app
3. Go to **Settings** → **Authentication** (or find the redirect URI settings)
4. Look for **Redirect URIs** or **Allowed Origins**
5. Add these URIs:

### For Local Development:
```
http://localhost:8080
http://127.0.0.1:8080
```

### If using Vite default port (5173):
```
http://localhost:5173
http://127.0.0.1:5173
```

## Step 2: Check Your Current URL

Make sure the URL in your browser matches exactly what you added:
- If your dev server is on `http://localhost:8080`, add that
- If it's on `http://localhost:5173`, add that
- Check if there's a trailing slash issue

## Step 3: Configure Google Cloud Console

Since you have Google OAuth enabled in Privy with custom credentials:

1. Go to https://console.cloud.google.com
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID (the one starting with `285659104994...`)
5. Click **Edit**
6. Under **Authorized redirect URIs**, add:
   ```
   https://auth.privy.io/api/v1/oauth/google/callback
   ```
7. Save the changes

## Step 4: Clear Browser Cache & Restart

1. Clear browser cache/cookies for localhost
2. Restart your dev server:
   ```bash
   npm run dev
   ```
3. Try logging in again

## Quick Check: What Port Are You Using?

Run this to see what port Vite is using:
```bash
npm run dev
```

Look for output like:
```
VITE v6.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Or if configured for port 8080:
```
➜  Local:   http://localhost:8080/
```

**The redirect URI in Privy MUST match the exact URL you're accessing the app from.**

## Alternative: Use Privy's Default Google OAuth

If you want to avoid Google Cloud Console setup:

1. In Privy dashboard, go to Google OAuth settings
2. Click **Reset** to use Privy's default credentials
3. This uses Privy's shared OAuth app (no custom setup needed)

But you still need to configure the redirect URIs in Privy dashboard as mentioned in Step 1.

